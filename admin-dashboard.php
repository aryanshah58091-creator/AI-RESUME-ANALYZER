<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin-login.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

// Fetch statistics
$db = Database::getInstance();
$pdo = $db->getConnection();

// Get pending applications count
$stmt = $pdo->query("SELECT COUNT(*) as count FROM job_applications WHERE status = 'pending'");
$pendingCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get accepted applications count
$stmt = $pdo->query("SELECT COUNT(*) as count FROM job_applications WHERE status = 'accepted'");
$acceptedCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get total users
$stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
$totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get total jobs
$stmt = $pdo->query("SELECT COUNT(*) as count FROM jobs");
$totalJobs = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Career Connect</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
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
            color: #667eea;
            font-size: 28px;
        }
        
        .logout-btn {
            background: #f56565;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-weight: bold;
        }
        
        .logout-btn:hover {
            background: #e53e3e;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        
        .stat-card h3 {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .stat-card .number {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
        }
        
        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .action-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-decoration: none;
            color: inherit;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .action-card.pending {
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
            color: white;
        }
        
        .action-card.accepted {
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
            color: white;
        }
        
        .action-card.users {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            color: #333;
        }
        
        .action-card.jobs {
            background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
            color: #333;
        }
        
        .action-card h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .action-card p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .action-card .badge {
            display: inline-block;
            background: rgba(255,255,255,0.3);
            padding: 5px 15px;
            border-radius: 20px;
            margin-top: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Admin Panel - Career Connect</h1>
            <a href="admin-logout.php" class="logout-btn">Logout</a>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Pending Applications</h3>
                <div class="number"><?php echo $pendingCount; ?></div>
            </div>
            <div class="stat-card">
                <h3>Accepted Applications</h3>
                <div class="number"><?php echo $acceptedCount; ?></div>
            </div>
            <div class="stat-card">
                <h3>Total Users</h3>
                <div class="number"><?php echo $totalUsers; ?></div>
            </div>
            <div class="stat-card">
                <h3>Total Jobs</h3>
                <div class="number"><?php echo $totalJobs; ?></div>
            </div>
        </div>
        
        <div class="actions-grid">
            <a href="admin-pending.php" class="action-card pending">
                <h2>📋 Pending Applications</h2>
                <p>Review and manage pending job applications</p>
                <div class="badge"><?php echo $pendingCount; ?> Pending</div>
            </a>
            
            <a href="admin-accepted.php" class="action-card accepted">
                <h2>✅ Accepted Applications</h2>
                <p>View all accepted applications</p>
                <div class="badge"><?php echo $acceptedCount; ?> Accepted</div>
            </a>
            
            <a href="admin-users.php" class="action-card users">
                <h2>👥 Manage Users</h2>
                <p>View and manage all registered users</p>
                <div class="badge"><?php echo $totalUsers; ?> Users</div>
            </a>
            
            <a href="admin-jobs.php" class="action-card jobs">
                <h2>💼 Manage Jobs</h2>
                <p>Add, edit, and manage job listings</p>
                <div class="badge"><?php echo $totalJobs; ?> Jobs</div>
            </a>
        </div>
    </div>
</body>
</html>
