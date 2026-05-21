<?php
session_start();
if (!isset($_SESSION['recruiter_logged_in'])) { header('Location: recruiter-login.php'); exit(); }
require_once __DIR__ . '/backend/config/database.php';
$db  = Database::getInstance()->getConnection();
$rid = $_SESSION['recruiter_id'];
$msg = '';

// Move stage
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['app_id'], $_POST['stage'])) {
    $stages  = ['applied','screening','interview','offer','hired','rejected'];
    $appId   = (int)$_POST['app_id'];
    $stage   = $_POST['stage'];
    $notes   = trim($_POST['notes'] ?? '');
    $idate   = $_POST['interview_date'] ?? '';

    if (in_array($stage, $stages)) {
        $check = $db->prepare("SELECT ja.id FROM job_applications ja JOIN jobs j ON ja.job_id=j.id WHERE ja.id=:aid AND j.recruiter_id=:rid");
        $check->execute([':aid'=>$appId,':rid'=>$rid]);
        if ($check->fetch()) {
            // Map stage to overall status
            $status = $stage === 'hired' ? 'accepted' : ($stage === 'rejected' ? 'rejected' : 'pending');
            $db->prepare("UPDATE job_applications SET interview_stage=:s, status=:st, interview_notes=:n, interview_date=:id WHERE id=:id2")
               ->execute([':s'=>$stage,':st'=>$status,':n'=>$notes?:null,':id'=>$idate?:null,':id2'=>$appId]);
            $msg = "✅ Moved to <strong>".ucfirst($stage)."</strong> stage.";

            // Notify recruiter (log)
            if (in_array($stage, ['hired','rejected','offer'])) {
                $sub = $db->prepare("SELECT u.name FROM job_applications ja JOIN users u ON ja.user_id=u.id WHERE ja.id=:id");
                $sub->execute([':id'=>$appId]);
                $uname = $sub->fetchColumn();
                $db->prepare("INSERT INTO recruiter_notifications (recruiter_id,type,title,message) VALUES(:rid,:t,:ti,:m)")
                   ->execute([':rid'=>$rid,':t'=>'pipeline',':ti'=>"Stage Update: $stage",':m'=>"$uname moved to ".ucfirst($stage)." stage."]);
            }
        }
    }
}

// Job filter
$jobId = isset($_GET['job_id']) ? (int)$_GET['job_id'] : null;
$myJobs = $db->prepare("SELECT id, job_title FROM jobs WHERE recruiter_id=:rid ORDER BY created_at DESC");
$myJobs->execute([':rid'=>$rid]);
$myJobs = $myJobs->fetchAll(PDO::FETCH_ASSOC);

// Fetch all applicants for recruiter per stage
$baseQ = "SELECT ja.id, ja.match_score, ja.interview_stage, ja.interview_date, ja.interview_notes, ja.status, ja.applied_at,
                 u.name AS uname, u.email AS uemail, j.job_title, j.id AS jid
          FROM job_applications ja
          JOIN users u ON ja.user_id=u.id
          JOIN jobs j ON ja.job_id=j.id
          WHERE j.recruiter_id=:rid";
$params = [':rid'=>$rid];
if ($jobId) { $baseQ .= " AND j.id=:jid"; $params[':jid']=$jobId; }
$baseQ .= " ORDER BY ja.match_score DESC";
$astmt = $db->prepare($baseQ);
$astmt->execute($params);
$all = $astmt->fetchAll(PDO::FETCH_ASSOC);

$stages = ['applied','screening','interview','offer','hired','rejected'];
$buckets = array_fill_keys($stages, []);
foreach ($all as $a) { $buckets[$a['interview_stage'] ?? 'applied'][] = $a; }

$stageConfig = [
    'applied'   => ['label'=>'Applied',    'icon'=>'📥', 'color'=>'#6366f1', 'bg'=>'rgba(99,102,241,0.12)'],
    'screening' => ['label'=>'Screening',  'icon'=>'🔍', 'color'=>'#f59e0b', 'bg'=>'rgba(245,158,11,0.12)'],
    'interview' => ['label'=>'Interview',  'icon'=>'💬', 'color'=>'#3b82f6', 'bg'=>'rgba(59,130,246,0.12)'],
    'offer'     => ['label'=>'Offer',      'icon'=>'📄', 'color'=>'#8b5cf6', 'bg'=>'rgba(139,92,246,0.12)'],
    'hired'     => ['label'=>'Hired',      'icon'=>'✅', 'color'=>'#10b981', 'bg'=>'rgba(16,185,129,0.12)'],
    'rejected'  => ['label'=>'Rejected',   'icon'=>'❌', 'color'=>'#ef4444', 'bg'=>'rgba(239,68,68,0.12)'],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Interview Pipeline – Recruiter</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#064e3b 0%,#065f46 40%,#047857 100%);min-height:100vh;padding:20px}
.topbar{background:#fff;border-radius:14px;padding:14px 22px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 6px 20px rgba(0,0,0,.18);flex-wrap:wrap;gap:10px}
.topbar h1{font-size:20px;font-weight:800;color:#064e3b}
.nav-links{display:flex;gap:8px;flex-wrap:wrap}
.nav-link{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;background:#f3f4f6;color:#374151;transition:background .2s}
.nav-link:hover{background:#e5e7eb}
.nav-link.active{background:#059669;color:#fff}
.msg{background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:14px;font-weight:600}
.filter-bar{background:#fff;border-radius:12px;padding:12px 18px;margin-bottom:18px;box-shadow:0 4px 14px rgba(0,0,0,.12);display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.filter-bar label{font-size:13px;font-weight:600;color:#374151}
.filter-bar select{padding:7px 12px;border:2px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;color:#111827}
.filter-bar select:focus{outline:none;border-color:#10b981}
.summary{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.scard{flex:1;min-width:110px;background:#fff;border-radius:12px;padding:14px 16px;box-shadow:0 4px 14px rgba(0,0,0,.12);text-align:center}
.scard .sc-num{font-size:26px;font-weight:800;margin-bottom:2px}
.scard .sc-lbl{font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
/* Kanban */
.kanban{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;overflow-x:auto;padding-bottom:10px}
@media(max-width:1100px){.kanban{grid-template-columns:repeat(3,1fr)}}
@media(max-width:700px){.kanban{grid-template-columns:repeat(2,1fr)}}
.column{border-radius:14px;overflow:hidden;min-height:400px}
.col-header{padding:12px 14px;font-size:13px;font-weight:700;display:flex;justify-content:space-between;align-items:center}
.col-header .cnt{background:rgba(0,0,0,.15);border-radius:20px;padding:2px 8px;font-size:12px}
.col-body{padding:10px;display:flex;flex-direction:column;gap:8px;min-height:340px}
.card{background:#fff;border-radius:11px;padding:12px 14px;box-shadow:0 3px 10px rgba(0,0,0,.1);cursor:pointer;transition:transform .2s,box-shadow .2s}
.card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.15)}
.card-name{font-size:13px;font-weight:700;color:#111827;margin-bottom:3px}
.card-job{font-size:11px;color:#6b7280;margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card-score{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800}
.sc-hi{background:#d1fae5;color:#065f46}.sc-md{background:#fef3c7;color:#92400e}.sc-lo{background:#fee2e2;color:#991b1b}
.card-date{font-size:10px;color:#9ca3af;margin-top:6px}
.card-actions{margin-top:8px;display:flex;gap:5px;flex-wrap:wrap}
.move-btn{padding:4px 9px;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;background:#f3f4f6;color:#374151;transition:background .15s}
.move-btn:hover{background:#e5e7eb}
/* Modal */
.modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:999;align-items:center;justify-content:center}
.modal-bg.open{display:flex}
.modal{background:#fff;border-radius:18px;padding:28px 26px;max-width:420px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.modal h3{font-size:17px;font-weight:800;color:#111827;margin-bottom:16px}
.modal label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:5px;margin-top:12px}
.modal select,.modal textarea,.modal input[type=datetime-local]{width:100%;padding:10px 13px;border:2px solid #e5e7eb;border-radius:9px;font-size:14px;font-family:inherit;color:#111827}
.modal select:focus,.modal textarea:focus,.modal input:focus{outline:none;border-color:#10b981}
.modal textarea{resize:vertical;min-height:80px}
.mbtns{display:flex;gap:10px;margin-top:16px}
.mbtn-cancel{flex:1;padding:11px;background:#f3f4f6;color:#374151;border:none;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
.mbtn-save{flex:1;padding:11px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.mbtn-save:hover{opacity:.9}
</style>
</head>
<body>
<div style="max-width:1400px;margin:0 auto">
  <div class="topbar">
    <h1>🔄 Interview Pipeline</h1>
    <div class="nav-links">
      <a href="recruiter-dashboard.php"  class="nav-link">📊 Dashboard</a>
      <a href="recruiter-pipeline.php"   class="nav-link active">🔄 Pipeline</a>
      <a href="recruiter-analytics.php"  class="nav-link">📈 Analytics</a>
      <a href="recruiter-talent-pool.php" class="nav-link">💼 Talent Pool</a>
      <a href="recruiter-applicants.php" class="nav-link">👥 Applicants</a>
      <a href="recruiter-my-jobs.php"    class="nav-link">📂 My Jobs</a>
      <a href="recruiter-logout.php"     class="nav-link" style="color:#dc2626">Logout</a>
    </div>
  </div>

  <?php if($msg): ?><div class="msg"><?= $msg ?></div><?php endif; ?>

  <!-- Filter -->
  <div class="filter-bar">
    <label>Filter by Job:</label>
    <select onchange="location.href='?job_id='+this.value">
      <option value="">— All Jobs —</option>
      <?php foreach($myJobs as $j): ?>
      <option value="<?= $j['id'] ?>" <?= $jobId==$j['id']?'selected':'' ?>><?= htmlspecialchars($j['job_title']) ?></option>
      <?php endforeach; ?>
    </select>
    <span style="font-size:13px;color:#6b7280;margin-left:auto">
      <strong style="color:#059669"><?= count($all) ?></strong> total candidates
    </span>
  </div>

  <!-- Summary Row -->
  <div class="summary">
    <?php foreach($stageConfig as $sk=>$sc): ?>
    <div class="scard">
      <div class="sc-num" style="color:<?= $sc['color'] ?>"><?= count($buckets[$sk]) ?></div>
      <div class="sc-lbl"><?= $sc['icon'] ?> <?= $sc['label'] ?></div>
    </div>
    <?php endforeach; ?>
  </div>

  <!-- Kanban Board -->
  <div class="kanban">
    <?php foreach($stages as $st):
      $cfg = $stageConfig[$st];
      $cards = $buckets[$st];
    ?>
    <div class="column" style="background:<?= $cfg['bg'] ?>;border:2px solid <?= $cfg['color'] ?>22">
      <div class="col-header" style="background:<?= $cfg['color'] ?>;color:#fff">
        <span><?= $cfg['icon'] ?> <?= $cfg['label'] ?></span>
        <span class="cnt"><?= count($cards) ?></span>
      </div>
      <div class="col-body">
        <?php foreach($cards as $c):
          $sc = $c['match_score']>=75?'sc-hi':($c['match_score']>=50?'sc-md':'sc-lo');
          $nextStages = array_filter($stages, fn($s)=>$s!==$st && $s!=='applied');
        ?>
        <div class="card" onclick="openModal(<?= $c['id'] ?>,'<?= addslashes($c['uname']) ?>','<?= $st ?>','<?= htmlspecialchars(addslashes($c['interview_notes']??'')) ?>','<?= $c['interview_date']??'' ?>')">
          <div class="card-name"><?= htmlspecialchars($c['uname']) ?></div>
          <div class="card-job"><?= htmlspecialchars($c['job_title']) ?></div>
          <span class="card-score <?= $sc ?>"><?= (int)$c['match_score'] ?>% match</span>
          <div class="card-date">Applied <?= date('M d',strtotime($c['applied_at'])) ?></div>
          <?php if($c['interview_date']): ?>
          <div class="card-date" style="color:#6366f1">📅 <?= date('M d, y H:i',strtotime($c['interview_date'])) ?></div>
          <?php endif; ?>
        </div>
        <?php endforeach; ?>
        <?php if(empty($cards)): ?>
        <div style="text-align:center;color:rgba(0,0,0,.3);padding:30px 0;font-size:12px">Empty</div>
        <?php endif; ?>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
</div>

<!-- Stage Move Modal -->
<div class="modal-bg" id="moveModal">
  <div class="modal">
    <h3>🔄 Move Candidate</h3>
    <p id="modal-name" style="font-weight:700;color:#064e3b;font-size:15px;margin-bottom:2px"></p>
    <p id="modal-cur" style="font-size:12px;color:#6b7280;margin-bottom:4px"></p>
    <form method="POST">
      <input type="hidden" name="app_id" id="modal-app-id">
      <label>Move to Stage</label>
      <select name="stage" id="modal-stage">
        <?php foreach($stages as $s): ?>
        <option value="<?= $s ?>"><?= $stageConfig[$s]['icon'] ?> <?= $stageConfig[$s]['label'] ?></option>
        <?php endforeach; ?>
      </select>
      <label>Interview Date/Time <span style="color:#9ca3af;font-weight:400">(optional)</span></label>
      <input type="datetime-local" name="interview_date" id="modal-idate">
      <label>Notes <span style="color:#9ca3af;font-weight:400">(optional)</span></label>
      <textarea name="notes" id="modal-notes" placeholder="Add interview notes, feedback…"></textarea>
      <div class="mbtns">
        <button type="button" class="mbtn-cancel" onclick="closeModal()">Cancel</button>
        <button type="submit" class="mbtn-save">Save & Move</button>
      </div>
    </form>
  </div>
</div>

<script>
function openModal(id, name, cur, notes, idate) {
  document.getElementById('modal-app-id').value = id;
  document.getElementById('modal-name').textContent = '👤 ' + name;
  document.getElementById('modal-cur').textContent = 'Currently in: ' + cur.charAt(0).toUpperCase() + cur.slice(1);
  document.getElementById('modal-notes').value = notes || '';
  document.getElementById('modal-idate').value = idate ? idate.replace(' ', 'T').substring(0,16) : '';
  document.getElementById('moveModal').classList.add('open');
}
function closeModal() { document.getElementById('moveModal').classList.remove('open'); }
document.getElementById('moveModal').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });
</script>
</body>
</html>
