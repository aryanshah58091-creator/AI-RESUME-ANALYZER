<?php
session_start();

if (!isset($_SESSION['recruiter_logged_in']) || $_SESSION['recruiter_logged_in'] !== true) {
    header('Location: recruiter-login.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$db  = Database::getInstance()->getConnection();
$rid = $_SESSION['recruiter_id'];

$message = '';

// Handle status toggle or delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jobId  = (int)($_POST['job_id'] ?? 0);
    $action = $_POST['action'] ?? '';

    // Ownership check
    $own = $db->prepare("SELECT id FROM jobs WHERE id = :id AND recruiter_id = :rid");
    $own->execute([':id' => $jobId, ':rid' => $rid]);

    if ($own->fetch()) {
        if ($action === 'close') {
            $db->prepare("UPDATE jobs SET status = 'closed' WHERE id = :id")->execute([':id' => $jobId]);
            $message = '✅ Job closed.';
        } elseif ($action === 'reopen') {
            $db->prepare("UPDATE jobs SET status = 'active' WHERE id = :id")->execute([':id' => $jobId]);
            $message = '✅ Job reopened.';
        } elseif ($action === 'delete') {
            $db->prepare("DELETE FROM job_applications WHERE job_id = :id")->execute([':id' => $jobId]);
            $db->prepare("DELETE FROM jobs WHERE id = :id")->execute([':id' => $jobId]);
            $message = '🗑️ Job deleted successfully.';
        }
    }
}

// Fetch recruiter's jobs
$stmt = $db->prepare(
    "SELECT j.*, (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) AS app_count
     FROM jobs j WHERE j.recruiter_id = :rid ORDER BY j.created_at DESC"
);
$stmt->execute([':rid' => $rid]);
$jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Jobs – Recruiter Panel</title>
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
            margin-bottom: 22px; box-shadow: 0 8px 24px rgba(0,0,0,0.18);
            display: flex; justify-content: space-between; align-items: center;
            flex-wrap: wrap; gap: 12px;
        }

        .header h1 { font-size: 22px; font-weight: 800; color: #064e3b; }

        .header-actions { display: flex; gap: 10px; }

        .btn {
            padding: 10px 18px; border: none; border-radius: 10px;
            font-size: 14px; font-weight: 600; cursor: pointer;
            text-decoration: none; display: inline-block;
            font-family: inherit; transition: transform .2s;
        }

        .btn-primary  { background: linear-gradient(135deg,#059669,#10b981); color: white; box-shadow: 0 4px 14px rgba(16,185,129,.4); }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-back     { background: #f3f4f6; color: #374151; }
        .btn-back:hover { background: #e5e7eb; }

        .msg {
            border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;
            font-weight: 600; font-size: 14px;
            background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;
        }

        /* Jobs grid */
        .jobs-grid { display: grid; gap: 16px; }

        .job-card {
            background: white; border-radius: 18px; padding: 24px 26px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            transition: transform .25s;
        }

        .job-card:hover { transform: translateY(-3px); }

        .job-top {
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 12px;
            margin-bottom: 14px;
        }

        .job-title { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 4px; }

        .job-meta { color: #6b7280; font-size: 13px; }
        .job-meta span { margin-right: 14px; }

        .badge-status {
            padding: 5px 14px; border-radius: 20px;
            font-size: 12px; font-weight: 700;
        }

        .badge-active { background: #d1fae5; color: #065f46; }
        .badge-closed { background: #fee2e2; color: #991b1b; }
        .badge-paused { background: #fef3c7; color: #92400e; }

        .skills-wrap { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; }

        .skill-tag {
            background: #eff6ff; color: #1e40af;
            padding: 4px 12px; border-radius: 20px;
            font-size: 12px; font-weight: 600;
        }

        .job-footer {
            display: flex; justify-content: space-between;
            align-items: center; flex-wrap: wrap; gap: 12px;
            margin-top: 14px; padding-top: 14px;
            border-top: 1px solid #f3f4f6;
        }

        .applicants-count { color: #374151; font-size: 14px; }
        .applicants-count strong { color: #059669; font-size: 18px; }

        .action-btns { display: flex; gap: 8px; flex-wrap: wrap; }

        .btn-sm {
            padding: 8px 15px; border: none; border-radius: 8px;
            font-size: 13px; font-weight: 600; cursor: pointer;
            font-family: inherit; text-decoration: none;
            display: inline-block; transition: transform .2s;
        }

        .btn-sm:hover { transform: scale(1.05); }

        .btn-apps   { background: #eff6ff; color: #1d4ed8; }
        .btn-close  { background: #fef3c7; color: #92400e; }
        .btn-open   { background: #d1fae5; color: #065f46; }
        .btn-delete { background: #fee2e2; color: #dc2626; }

        .no-data {
            background: white; border-radius: 18px; padding: 56px;
            text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .no-data p { color: #9ca3af; font-size: 16px; margin-bottom: 6px; }

        /* Confirm delete modal */
        .modal-backdrop {
            display: none; position: fixed; inset: 0;
            background: rgba(0,0,0,0.55); z-index: 999;
            align-items: center; justify-content: center;
        }

        .modal-backdrop.show { display: flex; }

        .modal {
            background: white; border-radius: 20px; padding: 36px 32px;
            max-width: 420px; width: 90%; text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }

        .modal h2 { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 10px; }
        .modal p  { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
        .modal-btns { display: flex; gap: 12px; }
        .modal-cancel { flex: 1; padding: 12px; background: #f3f4f6; color: #374151; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .modal-confirm { flex: 1; padding: 12px; background: #dc2626; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .modal-confirm:hover { background: #b91c1c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📂 My Jobs <span style="color:#6b7280;font-weight:500;font-size:16px">(<?php echo count($jobs); ?> total)</span></h1>
            <div class="header-actions">
                <a href="recruiter-post-job.php" class="btn btn-primary">+ Post New Job</a>
                <a href="recruiter-dashboard.php" class="btn btn-back">← Dashboard</a>
            </div>
        </div>

        <?php if ($message): ?>
            <div class="msg"><?php echo $message; ?></div>
        <?php endif; ?>

        <?php if (count($jobs) > 0): ?>
        <div class="jobs-grid">
            <?php foreach ($jobs as $job):
                $sc = $job['status'] === 'active' ? 'badge-active' : ($job['status'] === 'closed' ? 'badge-closed' : 'badge-paused');
                $skills = array_slice(array_map('trim', explode(',', $job['required_skills'] ?? '')), 0, 6);
            ?>
            <div class="job-card">
                <div class="job-top">
                    <div>
                        <div class="job-title"><?php echo htmlspecialchars($job['job_title']); ?></div>
                        <div class="job-meta">
                            <span>🏢 <?php echo htmlspecialchars($job['company_name']); ?></span>
                            <span>📍 <?php echo htmlspecialchars($job['location']); ?></span>
                            <?php if ($job['salary_range']): ?>
                            <span>💰 <?php echo htmlspecialchars($job['salary_range']); ?></span>
                            <?php endif; ?>
                            <?php if ($job['job_type']): ?>
                            <span>⏱ <?php echo ucfirst(htmlspecialchars($job['job_type'])); ?></span>
                            <?php endif; ?>
                        </div>
                    </div>
                    <span class="badge-status <?php echo $sc; ?>"><?php echo ucfirst($job['status']); ?></span>
                </div>

                <div class="skills-wrap">
                    <?php foreach ($skills as $s): ?>
                    <span class="skill-tag"><?php echo htmlspecialchars($s); ?></span>
                    <?php endforeach; ?>
                </div>

                <div class="job-footer">
                    <div class="applicants-count">
                        <strong><?php echo (int)$job['app_count']; ?></strong> applicant<?php echo $job['app_count'] != 1 ? 's' : ''; ?>
                        &nbsp;·&nbsp; Posted <?php echo date('M d, Y', strtotime($job['created_at'])); ?>
                    </div>
                    <div class="action-btns">
                        <a href="recruiter-applicants.php?job_id=<?php echo $job['id']; ?>" class="btn-sm btn-apps">👥 Applicants</a>

                        <?php if ($job['status'] === 'active'): ?>
                        <form method="POST" style="display:inline">
                            <input type="hidden" name="job_id" value="<?php echo $job['id']; ?>">
                            <input type="hidden" name="action" value="close">
                            <button type="submit" class="btn-sm btn-close">⏸ Close</button>
                        </form>
                        <?php else: ?>
                        <form method="POST" style="display:inline">
                            <input type="hidden" name="job_id" value="<?php echo $job['id']; ?>">
                            <input type="hidden" name="action" value="reopen">
                            <button type="submit" class="btn-sm btn-open">▶ Reopen</button>
                        </form>
                        <?php endif; ?>

                        <button type="button" class="btn-sm btn-delete"
                            onclick="confirmDelete(<?php echo $job['id']; ?>, '<?php echo addslashes($job['job_title']); ?>')">
                            🗑 Delete
                        </button>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <?php else: ?>
        <div class="no-data">
            <p style="font-size:48px;margin-bottom:12px">📭</p>
            <p>No jobs posted yet!</p>
            <p style="font-size:14px">Start by posting your first job listing.</p>
            <a href="recruiter-post-job.php" class="btn btn-primary" style="margin-top:18px">+ Post a Job</a>
        </div>
        <?php endif; ?>
    </div>

    <!-- Delete Confirm Modal -->
    <div class="modal-backdrop" id="deleteModal">
        <div class="modal">
            <p style="font-size:44px;margin-bottom:10px">⚠️</p>
            <h2>Delete this job?</h2>
            <p id="deleteJobName" style="font-weight:600;color:#374151;margin-bottom:6px"></p>
            <p>This will permanently remove the job and ALL its applications. This cannot be undone.</p>
            <form method="POST" id="deleteForm">
                <input type="hidden" name="job_id" id="deleteJobId">
                <input type="hidden" name="action" value="delete">
                <div class="modal-btns">
                    <button type="button" class="modal-cancel" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="modal-confirm">Yes, Delete</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function confirmDelete(id, title) {
            document.getElementById('deleteJobId').value = id;
            document.getElementById('deleteJobName').textContent = '"' + title + '"';
            document.getElementById('deleteModal').classList.add('show');
        }
        function closeModal() {
            document.getElementById('deleteModal').classList.remove('show');
        }
        document.getElementById('deleteModal').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    </script>
</body>
</html>
