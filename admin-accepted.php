<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin-login.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$db = Database::getInstance();
$pdo = $db->getConnection();

// Fetch accepted applications
$query = "SELECT 
    ja.id,
    ja.applied_at,
    ja.match_score,
    ja.status,
    u.name as student_name,
    u.email as student_email,
    j.title as job_title,
    j.company as company_name
FROM job_applications ja
JOIN users u ON ja.user_id = u.id
JOIN jobs j ON ja.job_id = j.id
WHERE ja.status = 'accepted'
ORDER BY ja.applied_at DESC";

$stmt = $pdo->query($query);
$applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate statistics
$totalCandidates = count($applications);
$uniqueCompanies = count(array_unique(array_column($applications, 'company_name')));
$avgScore = $totalCandidates > 0 ? round(array_sum(array_column($applications, 'match_score')) / $totalCandidates) : 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accepted Applications - Admin Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 20px 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            color: #10b981;
            font-size: 28px;
        }
        
        .back-btn {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-weight: bold;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        
        .stat-card h3 {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .stat-card .number {
            font-size: 36px;
            font-weight: bold;
            color: #10b981;
        }
        
        .table-container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th {
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
        }
        
        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        tr:hover {
            background: #f9f9f9;
        }
        
        .match-score {
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 5px;
            display: inline-block;
            background: #d4edda;
            color: #155724;
        }
        
        .status-badge {
            background: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Accepted Applications</h1>
            <a href="admin-dashboard.php" class="back-btn">← Back to Dashboard</a>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Candidates</h3>
                <div class="number"><?php echo $totalCandidates; ?></div>
            </div>
            <div class="stat-card">
                <h3>Unique Companies</h3>
                <div class="number"><?php echo $uniqueCompanies; ?></div>
            </div>
            <div class="stat-card">
                <h3>Avg Match Score</h3>
                <div class="number"><?php echo $avgScore; ?>%</div>
            </div>
        </div>
        
        <div class="table-container">
            <?php if (count($applications) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Job Role</th>
                            <th>Applied Date</th>
                            <th>Match Score</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($applications as $app): ?>
                            <tr>
                                <td><strong><?php echo htmlspecialchars($app['student_name']); ?></strong></td>
                                <td><?php echo htmlspecialchars($app['student_email']); ?></td>
                                <td><?php echo htmlspecialchars($app['company_name']); ?></td>
                                <td><?php echo htmlspecialchars($app['job_title']); ?></td>
                                <td><?php echo date('M d, Y', strtotime($app['applied_at'])); ?></td>
                                <td>
                                    <span class="match-score"><?php echo $app['match_score']; ?>%</span>
                                </td>
                                <td>
                                    <span class="status-badge">Accepted</span>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">
                    <p>📭 No accepted applications yet!</p>
                    <p style="font-size: 14px; margin-top: 10px; color: #999;">Start accepting applications from the pending list.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
