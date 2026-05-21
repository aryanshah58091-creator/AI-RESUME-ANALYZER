<?php
session_start();

if (!isset($_SESSION['recruiter_logged_in']) || $_SESSION['recruiter_logged_in'] !== true) {
    header('Location: recruiter-login.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$db  = Database::getInstance()->getConnection();
$rid = $_SESSION['recruiter_id'];

// Stats
$totalJobs   = $db->prepare("SELECT COUNT(*) FROM jobs WHERE recruiter_id = :rid");
$totalJobs->execute([':rid' => $rid]);

$activeJobs  = $db->prepare("SELECT COUNT(*) FROM jobs WHERE recruiter_id = :rid AND status = 'active'");
$activeJobs->execute([':rid' => $rid]);

$totalApps   = $db->prepare("SELECT COUNT(*) FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE j.recruiter_id = :rid");
$totalApps->execute([':rid' => $rid]);

$pendingApps = $db->prepare("SELECT COUNT(*) FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE j.recruiter_id = :rid AND ja.status = 'pending'");
$pendingApps->execute([':rid' => $rid]);

// Recent jobs
$recentJobs = $db->prepare(
    "SELECT j.*, (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) AS app_count
     FROM jobs j WHERE j.recruiter_id = :rid ORDER BY j.created_at DESC LIMIT 5"
);
$recentJobs->execute([':rid' => $rid]);
$jobs = $recentJobs->fetchAll(PDO::FETCH_ASSOC);

$stats = [
    $totalJobs->fetchColumn(),
    $activeJobs->fetchColumn(),
    $totalApps->fetchColumn(),
    $pendingApps->fetchColumn(),
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recruiter Dashboard – Career Connect</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%);
            min-height: 100vh; padding: 24px;
        }

        .container { max-width: 1200px; margin: 0 auto; }

        /* Header */
        .header {
            background: white; padding: 20px 28px; border-radius: 18px;
            margin-bottom: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex; justify-content: space-between; align-items: center;
            flex-wrap: wrap; gap: 12px;
        }

        .header-left { display: flex; align-items: center; gap: 14px; }

        .header-icon {
            width: 52px; height: 52px; border-radius: 14px;
            background: linear-gradient(135deg, #059669, #10b981);
            display: flex; align-items: center; justify-content: center;
            font-size: 26px; flex-shrink: 0;
        }

        .header h1 { font-size: 22px; font-weight: 800; color: #064e3b; }
        .header p  { color: #6b7280; font-size: 14px; margin-top: 2px; }

        .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        .btn {
            padding: 10px 20px; border: none; border-radius: 10px;
            font-size: 14px; font-weight: 600; cursor: pointer;
            text-decoration: none; display: inline-block;
            font-family: inherit; transition: transform .2s, box-shadow .2s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #059669, #10b981);
            color: white; box-shadow: 0 4px 14px rgba(16,185,129,0.4);
        }

        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16,185,129,0.5); }

        .btn-outline {
            background: white; color: #059669;
            border: 2px solid #10b981;
        }

        .btn-outline:hover { background: #f0fdf4; }

        .btn-danger {
            background: #fef2f2; color: #dc2626;
            border: 2px solid #fca5a5;
        }

        .btn-danger:hover { background: #fee2e2; }

        /* Stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 18px; margin-bottom: 24px;
        }

        .stat-card {
            background: white; border-radius: 18px; padding: 24px 22px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex; align-items: center; gap: 18px;
            transition: transform .25s;
        }

        .stat-card:hover { transform: translateY(-4px); }

        .stat-icon {
            width: 56px; height: 56px; border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            font-size: 26px; flex-shrink: 0;
        }

        .stat-label { color: #6b7280; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
        .stat-value { font-size: 36px; font-weight: 800; color: #111827; line-height: 1; }

        /* Quick actions */
        .section-title {
            color: white; font-size: 18px; font-weight: 700;
            margin-bottom: 14px; opacity: 0.95;
        }

        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 18px; margin-bottom: 24px;
        }

        .action-card {
            padding: 26px 24px; border-radius: 18px; text-decoration: none;
            color: white; transition: transform .25s, box-shadow .25s;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }

        .action-card:hover { transform: translateY(-5px); box-shadow: 0 18px 40px rgba(0,0,0,0.35); }
        .action-card.green  { background: linear-gradient(135deg, #059669 0%, #34d399 100%); }
        .action-card.teal   { background: linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%); }
        .action-card.amber  { background: linear-gradient(135deg, #b45309 0%, #fbbf24 100%); }

        .action-card h2 { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
        .action-card p  { font-size: 13px; opacity: 0.88; }
        .action-card .badge {
            margin-top: 12px; display: inline-block;
            background: rgba(255,255,255,0.25); padding: 4px 14px;
            border-radius: 20px; font-size: 13px; font-weight: 600;
        }

        /* Recent jobs table */
        .table-card {
            background: white; border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            overflow: hidden;
        }

        .table-header {
            padding: 20px 24px; border-bottom: 1px solid #f3f4f6;
            display: flex; justify-content: space-between; align-items: center;
        }

        .table-header h2 { font-size: 17px; font-weight: 700; color: #111827; }

        table { width: 100%; border-collapse: collapse; }

        th {
            background: #f9fafb; padding: 13px 16px;
            text-align: left; font-size: 12px; font-weight: 700;
            color: #6b7280; text-transform: uppercase; letter-spacing: .5px;
            border-bottom: 1px solid #e5e7eb;
        }

        td { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f9fafb; }

        .badge-status {
            padding: 4px 12px; border-radius: 20px;
            font-size: 12px; font-weight: 700; display: inline-block;
        }

        .badge-active   { background: #d1fae5; color: #065f46; }
        .badge-closed   { background: #fee2e2; color: #991b1b; }
        .badge-paused   { background: #fef3c7; color: #92400e; }

        .no-data { text-align: center; padding: 48px; color: #9ca3af; }
        .no-data p { font-size: 16px; margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="header-icon">🏢</div>
                <div>
                    <h1>Recruiter Dashboard</h1>
                    <p>Welcome, <strong><?php echo htmlspecialchars($_SESSION['recruiter_name']); ?></strong>
                        — <?php echo htmlspecialchars($_SESSION['recruiter_company']); ?></p>
                </div>
            </div>
            <div class="header-actions">
                <a href="recruiter-post-job.php" class="btn btn-primary">+ Post New Job</a>
                <a href="recruiter-logout.php" class="btn btn-danger">Logout</a>
            </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
            <?php
            $statData = [
                ['📋', 'Total Jobs Posted',      $stats[0], '#d1fae5', '#059669'],
                ['✅', 'Active Jobs',             $stats[1], '#d1fae5', '#059669'],
                ['👥', 'Total Applications',      $stats[2], '#dbeafe', '#1d4ed8'],
                ['⏳', 'Pending Applications',    $stats[3], '#fef3c7', '#b45309'],
            ];
            foreach ($statData as [$icon, $label, $val, $bg, $clr]):
            ?>
            <div class="stat-card">
                <div class="stat-icon" style="background:<?php echo $bg; ?>; color:<?php echo $clr; ?>"><?php echo $icon; ?></div>
                <div>
                    <div class="stat-label"><?php echo $label; ?></div>
                    <div class="stat-value" style="color:<?php echo $clr; ?>"><?php echo (int)$val; ?></div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Quick Actions -->
        <div class="section-title">Quick Actions</div>
        <div class="actions-grid">
            <a href="recruiter-post-job.php" class="action-card green">
                <h2>➕ Post a New Job</h2>
                <p>Create a new listing and reach qualified candidates instantly</p>
                <div class="badge">Start Hiring</div>
            </a>
            <a href="recruiter-my-jobs.php" class="action-card teal">
                <h2>📂 Manage My Jobs</h2>
                <p>Edit, close or reopen your existing job listings</p>
                <div class="badge"><?php echo (int)$stats[0]; ?> Total Jobs</div>
            </a>
            <a href="recruiter-applicants.php" class="action-card amber">
                <h2>👀 View Applicants</h2>
                <p>Review candidates and update application statuses</p>
                <div class="badge"><?php echo (int)$stats[3]; ?> Pending</div>
            </a>
        </div>

        <!-- Recent Jobs -->
        <div class="section-title">Recent Job Listings</div>
        <div class="table-card">
            <div class="table-header">
                <h2>📌 My Latest Jobs</h2>
                <a href="recruiter-my-jobs.php" class="btn btn-outline">View All →</a>
            </div>
            <?php if (count($jobs) > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Applicants</th>
                        <th>Status</th>
                        <th>Posted</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($jobs as $job):
                        $sc = $job['status'] === 'active' ? 'badge-active' : ($job['status'] === 'closed' ? 'badge-closed' : 'badge-paused');
                    ?>
                    <tr>
                        <td><strong><?php echo htmlspecialchars($job['job_title']); ?></strong></td>
                        <td><?php echo htmlspecialchars($job['location']); ?></td>
                        <td><?php echo htmlspecialchars($job['job_type'] ?? '–'); ?></td>
                        <td style="text-align:center"><strong><?php echo (int)$job['app_count']; ?></strong></td>
                        <td><span class="badge-status <?php echo $sc; ?>"><?php echo ucfirst($job['status']); ?></span></td>
                        <td><?php echo date('M d, Y', strtotime($job['created_at'])); ?></td>
                        <td>
                            <a href="recruiter-applicants.php?job_id=<?php echo $job['id']; ?>"
                               style="color:#059669;font-weight:600;text-decoration:none;font-size:13px">
                               👥 Applicants
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php else: ?>
            <div class="no-data">
                <p>📭 No jobs posted yet</p>
                <p style="font-size:13px">Get started by posting your first job!</p>
                <a href="recruiter-post-job.php" class="btn btn-primary" style="margin-top:16px">+ Post a Job</a>
            </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
