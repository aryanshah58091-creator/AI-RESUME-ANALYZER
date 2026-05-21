<?php
session_start();

if (!isset($_SESSION['recruiter_logged_in']) || $_SESSION['recruiter_logged_in'] !== true) {
    header('Location: recruiter-login.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$db      = Database::getInstance()->getConnection();
$rid     = $_SESSION['recruiter_id'];
$jobId   = isset($_GET['job_id']) ? (int)$_GET['job_id'] : null;
$message = '';

// Handle application status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['app_id'], $_POST['status'])) {
    $appId  = (int)$_POST['app_id'];
    $status = $_POST['status'];
    $allowed = ['pending', 'accepted', 'rejected'];

    if (in_array($status, $allowed)) {
        // Verify recruiter owns that application's job
        $check = $db->prepare(
            "SELECT ja.id FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE ja.id = :aid AND j.recruiter_id = :rid"
        );
        $check->execute([':aid' => $appId, ':rid' => $rid]);
        if ($check->fetch()) {
            $db->prepare("UPDATE job_applications SET status = :s WHERE id = :id")
               ->execute([':s' => $status, ':id' => $appId]);
            $message = "✅ Applicant status updated to \"" . ucfirst($status) . "\".";
        }
    }
}

// Which job to show
$jobInfo = null;
if ($jobId) {
    $jstmt = $db->prepare("SELECT * FROM jobs WHERE id = :id AND recruiter_id = :rid");
    $jstmt->execute([':id' => $jobId, ':rid' => $rid]);
    $jobInfo = $jstmt->fetch(PDO::FETCH_ASSOC);
    if (!$jobInfo) { $jobId = null; } // not owned
}

// Fetch all jobs of this recruiter (for the job filter dropdown)
$allJobs = $db->prepare("SELECT id, job_title FROM jobs WHERE recruiter_id = :rid ORDER BY created_at DESC");
$allJobs->execute([':rid' => $rid]);
$myJobs = $allJobs->fetchAll(PDO::FETCH_ASSOC);

// Fetch applicants
$filterStatus = $_GET['status'] ?? 'all';
if ($jobId) {
    $query = "SELECT ja.id, ja.match_score, ja.status, ja.applied_at,
                     u.name AS applicant_name, u.email AS applicant_email,
                     r.file_name AS resume_file, r.analysis,
                     j.job_title
              FROM job_applications ja
              JOIN users u ON ja.user_id = u.id
              LEFT JOIN resumes r ON ja.resume_id = r.id
              JOIN jobs j ON ja.job_id = j.id
              WHERE ja.job_id = :jid";
    $params = [':jid' => $jobId];
} else {
    $query = "SELECT ja.id, ja.match_score, ja.status, ja.applied_at,
                     u.name AS applicant_name, u.email AS applicant_email,
                     r.file_name AS resume_file, r.analysis,
                     j.job_title
              FROM job_applications ja
              JOIN users u ON ja.user_id = u.id
              LEFT JOIN resumes r ON ja.resume_id = r.id
              JOIN jobs j ON ja.job_id = j.id
              WHERE j.recruiter_id = :rid";
    $params = [':rid' => $rid];
}

if ($filterStatus !== 'all') {
    $query  .= " AND ja.status = :st";
    $params[':st'] = $filterStatus;
}

$query .= " ORDER BY ja.match_score DESC, ja.applied_at ASC";
$astmt = $db->prepare($query);
$astmt->execute($params);
$applicants = $astmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Applicants – Recruiter Panel</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%);
            min-height: 100vh; padding: 24px;
        }

        .container { max-width: 1200px; margin: 0 auto; }

        .header {
            background: white; padding: 18px 26px; border-radius: 16px;
            margin-bottom: 20px; box-shadow: 0 8px 24px rgba(0,0,0,.18);
            display: flex; justify-content: space-between; align-items: center;
            flex-wrap: wrap; gap: 12px;
        }

        .header h1 { font-size: 22px; font-weight: 800; color: #064e3b; }

        .btn {
            padding: 9px 18px; border: none; border-radius: 10px;
            font-size: 14px; font-weight: 600; cursor: pointer;
            text-decoration: none; display: inline-block; font-family: inherit;
            transition: transform .2s;
        }

        .btn-back { background: #f3f4f6; color: #374151; }
        .btn-back:hover { background: #e5e7eb; }

        .msg {
            border-radius: 10px; padding: 13px 17px; margin-bottom: 18px;
            font-weight: 600; font-size: 14px;
            background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;
        }

        /* Filters */
        .filters {
            background: white; border-radius: 14px; padding: 16px 22px;
            box-shadow: 0 6px 18px rgba(0,0,0,.12); margin-bottom: 18px;
            display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
        }

        .filters label { font-size: 13px; font-weight: 600; color: #374151; }

        .filters select {
            padding: 8px 14px; border: 2px solid #e5e7eb; border-radius: 9px;
            font-family: inherit; font-size: 14px; color: #111827; cursor: pointer;
            transition: border-color .2s;
        }

        .filters select:focus { outline: none; border-color: #10b981; }

        .filter-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-left: auto; }

        .tab {
            padding: 6px 16px; border-radius: 20px; font-size: 13px;
            font-weight: 600; text-decoration: none; transition: all .2s;
            border: 2px solid transparent;
        }

        .tab.active { background: #059669; color: white; }
        .tab:not(.active) { background: #f3f4f6; color: #6b7280; border-color: #e5e7eb; }
        .tab:not(.active):hover { background: #e5e7eb; color: #374151; }

        /* Table */
        .table-card {
            background: white; border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,.15); overflow: hidden;
        }

        .table-header {
            padding: 18px 24px; border-bottom: 1px solid #f3f4f6;
            display: flex; justify-content: space-between; align-items: center;
        }

        .table-header h2 { font-size: 16px; font-weight: 700; color: #111827; }
        .count { color: #059669; font-size: 15px; font-weight: 700; }

        table { width: 100%; border-collapse: collapse; }

        th {
            background: #f9fafb; padding: 13px 16px;
            text-align: left; font-size: 11px; font-weight: 700;
            color: #6b7280; text-transform: uppercase; letter-spacing: .5px;
            border-bottom: 1px solid #e5e7eb;
        }

        td { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f9fafb; }

        .av {
            width: 38px; height: 38px; border-radius: 50%;
            background: linear-gradient(135deg, #059669, #34d399);
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; font-weight: 700; color: white;
            flex-shrink: 0;
        }

        .applicant-cell { display: flex; align-items: center; gap: 12px; }
        .applicant-name { font-weight: 700; color: #111827; font-size: 14px; }
        .applicant-email { color: #6b7280; font-size: 12px; margin-top: 2px; }

        .score {
            padding: 5px 12px; border-radius: 9px;
            font-size: 13px; font-weight: 800; display: inline-block;
        }

        .score-high   { background: #d1fae5; color: #065f46; }
        .score-medium { background: #fef3c7; color: #92400e; }
        .score-low    { background: #fee2e2; color: #991b1b; }

        .status-form select {
            padding: 7px 12px; border-radius: 8px;
            border: 2px solid #e5e7eb; font-size: 13px;
            font-family: inherit; cursor: pointer;
            transition: border-color .2s;
        }

        .status-form select:focus { outline: none; border-color: #10b981; }

        .status-form button {
            padding: 7px 14px; background: #059669; color: white;
            border: none; border-radius: 8px; font-size: 13px;
            font-weight: 600; cursor: pointer; font-family: inherit;
            margin-left: 6px; transition: background .2s;
        }

        .status-form button:hover { background: #047857; }

        .status-badge {
            padding: 4px 12px; border-radius: 20px; font-size: 12px;
            font-weight: 700; white-space: nowrap;
        }

        .st-pending  { background: #fef3c7; color: #92400e; }
        .st-accepted { background: #d1fae5; color: #065f46; }
        .st-rejected { background: #fee2e2; color: #991b1b; }

        .no-data { text-align: center; padding: 56px; color: #9ca3af; }
        .no-data p { font-size: 16px; margin-bottom: 6px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👥 Applicants
                <?php if ($jobInfo): ?>
                    <span style="color:#6b7280;font-size:16px;font-weight:500"> – <?php echo htmlspecialchars($jobInfo['job_title']); ?></span>
                <?php endif; ?>
            </h1>
            <a href="recruiter-dashboard.php" class="btn btn-back">← Dashboard</a>
        </div>

        <?php if ($message): ?><div class="msg"><?php echo $message; ?></div><?php endif; ?>

        <!-- Filters -->
        <div class="filters">
            <div>
                <label for="job_filter" style="margin-right:8px">Filter by Job:</label>
                <select id="job_filter" onchange="location.href='?job_id='+this.value+'&status=<?php echo urlencode($filterStatus); ?>'">
                    <option value="">— All My Jobs —</option>
                    <?php foreach ($myJobs as $j): ?>
                    <option value="<?php echo $j['id']; ?>" <?php echo ($jobId==$j['id'])?'selected':''; ?>>
                        <?php echo htmlspecialchars($j['job_title']); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="filter-tabs">
                <?php
                $statuses = ['all', 'pending', 'accepted', 'rejected'];
                foreach ($statuses as $s):
                    $href = '?status=' . $s . ($jobId ? '&job_id=' . $jobId : '');
                    $cls  = ($filterStatus === $s) ? 'tab active' : 'tab';
                ?>
                <a href="<?php echo $href; ?>" class="<?php echo $cls; ?>"><?php echo ucfirst($s); ?></a>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Table -->
        <div class="table-card">
            <div class="table-header">
                <h2>📋 Applications</h2>
                <span class="count"><?php echo count($applicants); ?> applicant<?php echo count($applicants)!=1?'s':''; ?></span>
            </div>

            <?php if (count($applicants) > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>Applicant</th>
                        <?php if (!$jobId): ?><th>Applied For</th><?php endif; ?>
                        <th>Match Score</th>
                        <th>Applied On</th>
                        <th>Current Status</th>
                        <th>Update Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($applicants as $app):
                        $score = (int)($app['match_score'] ?? 0);
                        $sc    = $score >= 75 ? 'score-high' : ($score >= 50 ? 'score-medium' : 'score-low');
                        $sBadge = 'st-' . ($app['status'] ?? 'pending');
                        // Parse matched skills from analysis JSON
                        $skills = [];
                        try {
                            $a = json_decode($app['analysis'] ?? '{}', true);
                            $skills = $a['matchedSkills'] ?? [];
                        } catch(Exception $e) {}
                    ?>
                    <tr>
                        <td>
                            <div class="applicant-cell">
                                <div class="av"><?php echo strtoupper(substr($app['applicant_name'],0,1)); ?></div>
                                <div>
                                    <div class="applicant-name"><?php echo htmlspecialchars($app['applicant_name']); ?></div>
                                    <div class="applicant-email"><?php echo htmlspecialchars($app['applicant_email']); ?></div>
                                    <?php if (!empty($skills)): ?>
                                    <div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px">
                                        <?php foreach (array_slice($skills,0,4) as $sk): ?>
                                        <span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600">✓ <?php echo htmlspecialchars($sk); ?></span>
                                        <?php endforeach; ?>
                                    </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </td>
                        <?php if (!$jobId): ?>
                        <td style="font-weight:600;color:#059669"><?php echo htmlspecialchars($app['job_title']); ?></td>
                        <?php endif; ?>
                        <td><span class="score <?php echo $sc; ?>"><?php echo $score; ?>%</span></td>
                        <td><?php echo date('M d, Y', strtotime($app['applied_at'])); ?></td>
                        <td><span class="status-badge <?php echo $sBadge; ?>"><?php echo ucfirst($app['status'] ?? 'pending'); ?></span></td>
                        <td>
                            <form method="POST" class="status-form" style="display:flex;align-items:center;gap:0">
                                <input type="hidden" name="app_id" value="<?php echo $app['id']; ?>">
                                <?php if ($jobId): ?><input type="hidden" name="job_id" value="<?php echo $jobId; ?>"><?php endif; ?>
                                <select name="status">
                                    <?php foreach (['pending','accepted','rejected'] as $st): ?>
                                    <option value="<?php echo $st; ?>" <?php echo ($app['status']===$st)?'selected':''; ?>><?php echo ucfirst($st); ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <button type="submit">Save</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php else: ?>
            <div class="no-data">
                <p style="font-size:44px;margin-bottom:10px">🕵️</p>
                <p>No applicants found<?php echo $filterStatus!=='all' ? " with status \"$filterStatus\"" : ''; ?>.</p>
                <?php if ($filterStatus !== 'all'): ?>
                <p><a href="?<?php echo $jobId?"job_id=$jobId":''; ?>" style="color:#059669;font-weight:600">View all statuses</a></p>
                <?php endif; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
