<?php
session_start();
if (!isset($_SESSION['recruiter_logged_in'])) { header('Location: recruiter-login.php'); exit(); }
require_once __DIR__ . '/backend/config/database.php';
$db  = Database::getInstance()->getConnection();
$rid = $_SESSION['recruiter_id'];

// ── Stats ────────────────────────────────────────────────────────
// Jobs
$jobStats = $db->prepare("SELECT COUNT(*) AS total, SUM(status='active') AS active, SUM(status='closed') AS closed FROM jobs WHERE recruiter_id=:rid");
$jobStats->execute([':rid'=>$rid]); $jobStats = $jobStats->fetch(PDO::FETCH_ASSOC);

// Applications by status
$appStatus = $db->prepare("SELECT ja.status, COUNT(*) AS cnt FROM job_applications ja JOIN jobs j ON ja.job_id=j.id WHERE j.recruiter_id=:rid GROUP BY ja.status");
$appStatus->execute([':rid'=>$rid]); $appStatus = $appStatus->fetchAll(PDO::FETCH_KEY_PAIR);

// Applications by stage
$stageData = $db->prepare("SELECT ja.interview_stage, COUNT(*) AS cnt FROM job_applications ja JOIN jobs j ON ja.job_id=j.id WHERE j.recruiter_id=:rid GROUP BY ja.interview_stage");
$stageData->execute([':rid'=>$rid]); $stageData = $stageData->fetchAll(PDO::FETCH_KEY_PAIR);

// Top jobs by applicants
$topJobs = $db->prepare("SELECT j.job_title, COUNT(ja.id) AS cnt, AVG(ja.match_score) AS avg_score FROM jobs j LEFT JOIN job_applications ja ON j.id=ja.job_id WHERE j.recruiter_id=:rid GROUP BY j.id ORDER BY cnt DESC LIMIT 6");
$topJobs->execute([':rid'=>$rid]); $topJobs = $topJobs->fetchAll(PDO::FETCH_ASSOC);

// Applications over last 14 days
$daily = $db->prepare("SELECT DATE(ja.applied_at) AS day, COUNT(*) AS cnt FROM job_applications ja JOIN jobs j ON ja.job_id=j.id WHERE j.recruiter_id=:rid AND ja.applied_at >= DATE_SUB(NOW(),INTERVAL 14 DAY) GROUP BY DATE(ja.applied_at) ORDER BY day");
$daily->execute([':rid'=>$rid]); $daily = $daily->fetchAll(PDO::FETCH_ASSOC);

// Match score distribution
$scoreDist = $db->prepare("SELECT CASE WHEN match_score<40 THEN '<40' WHEN match_score<60 THEN '40-59' WHEN match_score<80 THEN '60-79' ELSE '80+' END AS bucket, COUNT(*) AS cnt FROM job_applications ja JOIN jobs j ON ja.job_id=j.id WHERE j.recruiter_id=:rid GROUP BY bucket");
$scoreDist->execute([':rid'=>$rid]); $scoreDist = $scoreDist->fetchAll(PDO::FETCH_KEY_PAIR);

// Talent pool count
$tpCount = $db->prepare("SELECT COUNT(*) FROM talent_pool WHERE recruiter_id=:rid");
$tpCount->execute([':rid'=>$rid]); $tpCount = (int)$tpCount->fetchColumn();

// Unread notifications
$notifCount = $db->prepare("SELECT COUNT(*) FROM recruiter_notifications WHERE recruiter_id=:rid AND is_read=0");
$notifCount->execute([':rid'=>$rid]); $notifCount = (int)$notifCount->fetchColumn();

// Fill daily gaps
$daysMap = [];
for ($i=13;$i>=0;$i--) { $daysMap[date('Y-m-d', strtotime("-{$i} days"))]=0; }
foreach ($daily as $d) { if(isset($daysMap[$d['day']])) $daysMap[$d['day']]=$d['cnt']; }

$totalApps = array_sum($appStatus);
$acceptRate = $totalApps>0 ? round(($appStatus['accepted']??0)/$totalApps*100,1) : 0;
$rejectRate = $totalApps>0 ? round(($appStatus['rejected']??0)/$totalApps*100,1) : 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Analytics – Recruiter</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#064e3b 0%,#065f46 40%,#047857 100%);min-height:100vh;padding:20px}
.topbar{background:#fff;border-radius:14px;padding:14px 22px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 6px 20px rgba(0,0,0,.18);flex-wrap:wrap;gap:10px}
.topbar h1{font-size:20px;font-weight:800;color:#064e3b}
.nav-links{display:flex;gap:8px;flex-wrap:wrap}
.nav-link{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;background:#f3f4f6;color:#374151;transition:background .2s}
.nav-link:hover{background:#e5e7eb} .nav-link.active{background:#059669;color:#fff}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.grid-3{display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:18px}
@media(max-width:900px){.grid-4{grid-template-columns:repeat(2,1fr)}.grid-2,.grid-3{grid-template-columns:1fr}}
.kpi{background:#fff;border-radius:14px;padding:18px 20px;box-shadow:0 6px 18px rgba(0,0,0,.12)}
.kpi .kn{font-size:34px;font-weight:800;margin-bottom:4px}
.kpi .kl{font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.kpi .ks{font-size:12px;margin-top:6px;font-weight:600}
.chart-card{background:#fff;border-radius:14px;padding:20px 22px;box-shadow:0 6px 18px rgba(0,0,0,.12)}
.chart-card h2{font-size:15px;font-weight:800;color:#111827;margin-bottom:16px;display:flex;align-items:center;gap:8px}
table{width:100%;border-collapse:collapse}
th{background:#f9fafb;padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px}
td{padding:12px 14px;border-top:1px solid #f3f4f6;font-size:13px;color:#374151}
.score-bar-wrap{background:#f3f4f6;border-radius:20px;height:6px;width:100%;overflow:hidden}
.score-bar{height:6px;border-radius:20px;background:linear-gradient(90deg,#059669,#34d399)}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.badge-green{background:#d1fae5;color:#065f46}.badge-red{background:#fee2e2;color:#991b1b}.badge-yellow{background:#fef3c7;color:#92400e}
</style>
</head>
<body>
<div style="max-width:1300px;margin:0 auto">
  <div class="topbar">
    <h1>📈 Analytics</h1>
    <div class="nav-links">
      <a href="recruiter-dashboard.php" class="nav-link">📊 Dashboard</a>
      <a href="recruiter-pipeline.php"  class="nav-link">🔄 Pipeline</a>
      <a href="recruiter-analytics.php" class="nav-link active">📈 Analytics</a>
      <a href="recruiter-talent-pool.php" class="nav-link">💼 Talent Pool</a>
      <a href="recruiter-applicants.php" class="nav-link">👥 Applicants</a>
      <a href="recruiter-my-jobs.php"   class="nav-link">📂 My Jobs</a>
      <a href="recruiter-logout.php"    class="nav-link" style="color:#dc2626">Logout</a>
    </div>
  </div>

  <!-- KPI Row -->
  <div class="grid-4">
    <div class="kpi"><div class="kn" style="color:#059669"><?= $totalApps ?></div><div class="kl">Total Applications</div><div class="ks" style="color:#6b7280"><?= $appStatus['pending']??0 ?> pending review</div></div>
    <div class="kpi"><div class="kn" style="color:#10b981"><?= $acceptRate ?>%</div><div class="kl">Acceptance Rate</div><div class="ks" style="color:#10b981">↑ <?= $appStatus['accepted']??0 ?> hired</div></div>
    <div class="kpi"><div class="kn" style="color:#6366f1"><?= $jobStats['total']??0 ?></div><div class="kl">Jobs Posted</div><div class="ks" style="color:#6b7280"><?= $jobStats['active']??0 ?> active · <?= $jobStats['closed']??0 ?> closed</div></div>
    <div class="kpi"><div class="kn" style="color:#f59e0b"><?= $tpCount ?></div><div class="kl">Talent Pool</div><div class="ks" style="color:#6b7280">saved candidates</div></div>
  </div>

  <!-- Applications Over Time + Pipeline -->
  <div class="grid-3">
    <div class="chart-card">
      <h2>📅 Applications (Last 14 Days)</h2>
      <canvas id="lineChart" height="120"></canvas>
    </div>
    <div class="chart-card">
      <h2>🔄 Pipeline Breakdown</h2>
      <canvas id="pipeChart" height="180"></canvas>
    </div>
  </div>

  <!-- Match Score + Status -->
  <div class="grid-2">
    <div class="chart-card">
      <h2>🎯 Match Score Distribution</h2>
      <canvas id="scoreChart" height="160"></canvas>
    </div>
    <div class="chart-card">
      <h2>📊 Application Status</h2>
      <canvas id="statusChart" height="160"></canvas>
    </div>
  </div>

  <!-- Top Jobs Table -->
  <div class="chart-card" style="margin-bottom:18px">
    <h2>🏆 Job Performance</h2>
    <table>
      <thead><tr><th>#</th><th>Job Title</th><th>Applicants</th><th>Avg Match Score</th><th>Performance</th></tr></thead>
      <tbody>
        <?php foreach($topJobs as $i=>$j): $avg=(int)$j['avg_score']; ?>
        <tr>
          <td style="font-weight:700;color:#6b7280"><?= $i+1 ?></td>
          <td style="font-weight:700;color:#111827"><?= htmlspecialchars($j['job_title']) ?></td>
          <td><span class="badge badge-green"><?= (int)$j['cnt'] ?> apps</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="score-bar-wrap" style="width:80px"><div class="score-bar" style="width:<?= $avg ?>%"></div></div>
              <span style="font-size:12px;font-weight:700;color:#059669"><?= $avg ?>%</span>
            </div>
          </td>
          <td>
            <?php if($avg>=70): ?><span class="badge badge-green">🔥 High Quality</span>
            <?php elseif($avg>=50): ?><span class="badge badge-yellow">⚡ Moderate</span>
            <?php else: ?><span class="badge badge-red">📉 Low Match</span><?php endif; ?>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if(empty($topJobs)): ?>
        <tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:28px">No data yet — post jobs and receive applications.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<script>
const GREEN='#059669',AMBER='#f59e0b',RED='#ef4444',BLUE='#6366f1',PURPLE='#8b5cf6',TEAL='#14b8a6';
const lineCtx=document.getElementById('lineChart').getContext('2d');
new Chart(lineCtx,{type:'line',data:{labels:<?= json_encode(array_keys($daysMap)) ?>,datasets:[{label:'Applications',data:<?= json_encode(array_values($daysMap)) ?>,borderColor:GREEN,backgroundColor:'rgba(5,150,105,0.1)',borderWidth:2.5,fill:true,tension:.4,pointBackgroundColor:GREEN,pointRadius:4}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.05)'},ticks:{stepSize:1}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});

const pcStages=<?= json_encode(array_keys($stageData)) ?>;
const pcVals=<?= json_encode(array_values($stageData)) ?>;
const pcColors=[BLUE,AMBER,BLUE,PURPLE,GREEN,RED];
new Chart(document.getElementById('pipeChart').getContext('2d'),{type:'doughnut',data:{labels:pcStages.map(s=>s.charAt(0).toUpperCase()+s.slice(1)),datasets:[{data:pcVals,backgroundColor:pcColors,borderWidth:2,borderColor:'#fff'}]},options:{plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:10}}},cutout:'60%'}});

const sBuckets=<?= json_encode(['<40','40-59','60-79','80+']) ?>;
const sVals=sBuckets.map(b=>parseInt(<?= json_encode($scoreDist) ?>[b]||0));
new Chart(document.getElementById('scoreChart').getContext('2d'),{type:'bar',data:{labels:sBuckets,datasets:[{label:'Candidates',data:sVals,backgroundColor:[RED,AMBER,'#3b82f6',GREEN],borderRadius:8,borderSkipped:false}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.05)'}},x:{grid:{display:false}}}}});

const stData=<?= json_encode($appStatus) ?>;
new Chart(document.getElementById('statusChart').getContext('2d'),{type:'doughnut',data:{labels:['Pending','Accepted','Rejected'],datasets:[{data:[stData['pending']||0,stData['accepted']||0,stData['rejected']||0],backgroundColor:[AMBER,GREEN,RED],borderWidth:2,borderColor:'#fff'}]},options:{plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:10}}},cutout:'60%'}});
</script>
</body>
</html>
