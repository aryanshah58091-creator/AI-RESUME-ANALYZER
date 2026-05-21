<?php
session_start();
if (!isset($_SESSION['recruiter_logged_in'])) { header('Location: recruiter-login.php'); exit(); }
require_once __DIR__ . '/backend/config/database.php';
$db  = Database::getInstance()->getConnection();
$rid = $_SESSION['recruiter_id'];
$msg = ''; $msgType = 'success';

// Add to pool
if ($_SERVER['REQUEST_METHOD']==='POST' && $_POST['action']==='add') {
    $uid   = (int)$_POST['user_id'];
    $uname = trim($_POST['user_name']);
    $uemail= trim($_POST['user_email']);
    $notes = trim($_POST['notes']??'');
    $score = (int)($_POST['match_score']??0);
    try {
        $db->prepare("INSERT INTO talent_pool (recruiter_id,user_id,user_name,user_email,notes,match_score) VALUES(:rid,:uid,:un,:ue,:n,:s) ON DUPLICATE KEY UPDATE notes=VALUES(notes),saved_at=NOW()")
           ->execute([':rid'=>$rid,':uid'=>$uid,':un'=>$uname,':ue'=>$uemail,':n'=>$notes,':s'=>$score]);
        $msg = "✅ <strong>$uname</strong> added to Talent Pool!";
    } catch(Exception $e) { $msg='Error saving candidate.'; $msgType='error'; }
}

// Update notes
if ($_SERVER['REQUEST_METHOD']==='POST' && $_POST['action']==='update') {
    $tpid  = (int)$_POST['tp_id'];
    $notes = trim($_POST['notes']??'');
    $db->prepare("UPDATE talent_pool SET notes=:n WHERE id=:id AND recruiter_id=:rid")
       ->execute([':n'=>$notes,':id'=>$tpid,':rid'=>$rid]);
    $msg = "✅ Notes updated.";
}

// Remove from pool
if ($_SERVER['REQUEST_METHOD']==='POST' && $_POST['action']==='remove') {
    $tpid = (int)$_POST['tp_id'];
    $db->prepare("DELETE FROM talent_pool WHERE id=:id AND recruiter_id=:rid")->execute([':id'=>$tpid,':rid'=>$rid]);
    $msg = "🗑️ Candidate removed from Talent Pool.";
}

// Fetch pool
$search = trim($_GET['q']??'');
$poolQ  = "SELECT tp.*, GROUP_CONCAT(j.job_title ORDER BY ja.applied_at DESC SEPARATOR ', ') AS applied_jobs,
                  MAX(ja.status) AS last_status
           FROM talent_pool tp
           LEFT JOIN job_applications ja ON ja.user_id=tp.user_id
           LEFT JOIN jobs j ON ja.job_id=j.id AND j.recruiter_id=:rid2
           WHERE tp.recruiter_id=:rid";
$poolParams = [':rid'=>$rid,':rid2'=>$rid];
if ($search) { $poolQ .= " AND (tp.user_name LIKE :q OR tp.user_email LIKE :q2 OR tp.notes LIKE :q3)"; $poolParams[':q']="%$search%"; $poolParams[':q2']="%$search%"; $poolParams[':q3']="%$search%"; }
$poolQ .= " GROUP BY tp.id ORDER BY tp.saved_at DESC";
$pool = $db->prepare($poolQ); $pool->execute($poolParams); $pool = $pool->fetchAll(PDO::FETCH_ASSOC);

// Fetch candidates from recruiter's jobs not yet in talent pool
$suggestions = $db->prepare("SELECT DISTINCT u.id, u.name, u.email, MAX(ja.match_score) AS best_score FROM job_applications ja JOIN users u ON ja.user_id=u.id JOIN jobs j ON ja.job_id=j.id WHERE j.recruiter_id=:rid AND ja.match_score>=70 AND u.id NOT IN (SELECT user_id FROM talent_pool WHERE recruiter_id=:rid2) GROUP BY u.id ORDER BY best_score DESC LIMIT 10");
$suggestions->execute([':rid'=>$rid,':rid2'=>$rid]);
$suggestions = $suggestions->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Talent Pool – Recruiter</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#064e3b 0%,#065f46 40%,#047857 100%);min-height:100vh;padding:20px}
.topbar{background:#fff;border-radius:14px;padding:14px 22px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 6px 20px rgba(0,0,0,.18);flex-wrap:wrap;gap:10px}
.topbar h1{font-size:20px;font-weight:800;color:#064e3b}
.nav-links{display:flex;gap:8px;flex-wrap:wrap}
.nav-link{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;background:#f3f4f6;color:#374151;transition:background .2s}
.nav-link:hover{background:#e5e7eb} .nav-link.active{background:#059669;color:#fff}
.msg{border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:14px;font-weight:600;background:#d1fae5;color:#065f46;border:1px solid #6ee7b7}
.msg.error{background:#fee2e2;color:#991b1b;border-color:#fca5a5}
.two-col{display:grid;grid-template-columns:2fr 1fr;gap:18px}
@media(max-width:900px){.two-col{grid-template-columns:1fr}}
.card{background:#fff;border-radius:16px;padding:22px;box-shadow:0 6px 20px rgba(0,0,0,.12)}
.card h2{font-size:16px;font-weight:800;color:#111827;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center}
.search-bar{display:flex;gap:10px;margin-bottom:16px}
.search-bar input{flex:1;padding:9px 14px;border:2px solid #e5e7eb;border-radius:9px;font-size:14px;font-family:inherit}
.search-bar input:focus{outline:none;border-color:#10b981}
.search-bar button{padding:9px 18px;background:#059669;color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
/* Candidate cards */
.cand-grid{display:grid;gap:12px}
.cand-card{border:1px solid #e5e7eb;border-radius:13px;padding:16px 18px;transition:box-shadow .2s}
.cand-card:hover{box-shadow:0 6px 18px rgba(0,0,0,.1)}
.cand-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#059669,#34d399);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;flex-shrink:0}
.cname{font-size:14px;font-weight:700;color:#111827}
.cemail{font-size:12px;color:#6b7280}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.badge-green{background:#d1fae5;color:#065f46}.badge-blue{background:#dbeafe;color:#1e40af}.badge-yellow{background:#fef3c7;color:#92400e}
.cand-meta{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.notes-form textarea{width:100%;padding:8px 12px;border:2px solid #e5e7eb;border-radius:8px;font-size:12px;font-family:inherit;resize:none;min-height:55px;color:#374151}
.notes-form textarea:focus{outline:none;border-color:#10b981}
.notes-form-btns{display:flex;gap:8px;margin-top:6px}
.btn-save-note{padding:6px 14px;background:#059669;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.btn-remove{padding:6px 12px;background:#fee2e2;color:#dc2626;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
/* Suggestions */
.sug-item{border:1px solid #e5e7eb;border-radius:11px;padding:12px 14px;margin-bottom:9px;display:flex;justify-content:space-between;align-items:center;gap:10px}
.sug-add-btn{padding:7px 14px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
.empty{text-align:center;padding:36px;color:#9ca3af}
</style>
</head>
<body>
<div style="max-width:1300px;margin:0 auto">
  <div class="topbar">
    <h1>💼 Talent Pool</h1>
    <div class="nav-links">
      <a href="recruiter-dashboard.php"  class="nav-link">📊 Dashboard</a>
      <a href="recruiter-pipeline.php"   class="nav-link">🔄 Pipeline</a>
      <a href="recruiter-analytics.php"  class="nav-link">📈 Analytics</a>
      <a href="recruiter-talent-pool.php" class="nav-link active">💼 Talent Pool</a>
      <a href="recruiter-applicants.php" class="nav-link">👥 Applicants</a>
      <a href="recruiter-my-jobs.php"    class="nav-link">📂 My Jobs</a>
      <a href="recruiter-logout.php"     class="nav-link" style="color:#dc2626">Logout</a>
    </div>
  </div>

  <?php if($msg): ?><div class="msg <?= $msgType==='error'?'error':'' ?>"><?= $msg ?></div><?php endif; ?>

  <div class="two-col">
    <!-- Saved Candidates -->
    <div class="card">
      <h2>⭐ Saved Candidates <span style="color:#059669;font-size:14px;font-weight:600"><?= count($pool) ?> saved</span></h2>
      <form method="GET" class="search-bar">
        <input type="text" name="q" placeholder="Search by name, email, or notes…" value="<?= htmlspecialchars($search) ?>">
        <button type="submit">🔍 Search</button>
      </form>

      <div class="cand-grid">
        <?php foreach($pool as $c): ?>
        <div class="cand-card">
          <div class="cand-top">
            <div class="av"><?= strtoupper(substr($c['user_name'],0,1)) ?></div>
            <div>
              <div class="cname"><?= htmlspecialchars($c['user_name']) ?></div>
              <div class="cemail"><?= htmlspecialchars($c['user_email']) ?></div>
            </div>
            <?php if($c['match_score']): ?>
            <span class="badge badge-green" style="margin-left:auto">🎯 <?= $c['match_score'] ?>% match</span>
            <?php endif; ?>
          </div>

          <div class="cand-meta">
            <span class="badge badge-blue">💾 Saved <?= date('M d, Y',strtotime($c['saved_at'])) ?></span>
            <?php if($c['applied_jobs']): ?>
            <span class="badge" style="background:#f3f4f6;color:#374151">📋 <?= htmlspecialchars(mb_strimwidth($c['applied_jobs'],0,45,'…')) ?></span>
            <?php endif; ?>
          </div>

          <form method="POST" class="notes-form">
            <input type="hidden" name="action" value="update">
            <input type="hidden" name="tp_id" value="<?= $c['id'] ?>">
            <textarea name="notes" placeholder="Add recruiter notes…"><?= htmlspecialchars($c['notes']??'') ?></textarea>
            <div class="notes-form-btns">
              <button type="submit" class="btn-save-note">💾 Save Notes</button>
            </div>
          </form>

          <form method="POST" style="margin-top:7px" onsubmit="return confirm('Remove from Talent Pool?')">
            <input type="hidden" name="action" value="remove">
            <input type="hidden" name="tp_id" value="<?= $c['id'] ?>">
            <button type="submit" class="btn-remove">🗑 Remove</button>
          </form>
        </div>
        <?php endforeach; ?>
        <?php if(empty($pool)): ?>
        <div class="empty">
          <p style="font-size:40px;margin-bottom:10px">💼</p>
          <p>No saved candidates yet.</p>
          <p style="font-size:13px;margin-top:4px">High-match applicants appear on the right as suggestions.</p>
        </div>
        <?php endif; ?>
      </div>
    </div>

    <!-- AI Suggestions -->
    <div>
      <div class="card">
        <h2>🤖 AI Suggestions <span style="font-size:12px;color:#6b7280;font-weight:500">≥70% match</span></h2>
        <?php if(empty($suggestions)): ?>
        <div class="empty">
          <p style="font-size:30px;margin-bottom:8px">🔍</p>
          <p style="font-size:13px">No high-match candidates to suggest yet.</p>
        </div>
        <?php else: ?>
        <?php foreach($suggestions as $s): ?>
        <div class="sug-item">
          <div>
            <div style="font-size:13px;font-weight:700;color:#111827"><?= htmlspecialchars($s['name']) ?></div>
            <div style="font-size:11px;color:#6b7280"><?= htmlspecialchars($s['email']) ?></div>
            <span class="badge badge-green" style="margin-top:4px">🎯 <?= (int)$s['best_score'] ?>% best match</span>
          </div>
          <form method="POST">
            <input type="hidden" name="action" value="add">
            <input type="hidden" name="user_id" value="<?= $s['id'] ?>">
            <input type="hidden" name="user_name" value="<?= htmlspecialchars($s['name']) ?>">
            <input type="hidden" name="user_email" value="<?= htmlspecialchars($s['email']) ?>">
            <input type="hidden" name="match_score" value="<?= (int)$s['best_score'] ?>">
            <button type="submit" class="sug-add-btn">+ Save</button>
          </form>
        </div>
        <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
</body>
</html>
