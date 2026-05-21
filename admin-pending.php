<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin-login.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$db = Database::getInstance();
$pdo = $db->getConnection();

// Handle accept/reject actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && isset($_POST['application_id'])) {
    $applicationId = $_POST['application_id'];
    $action = $_POST['action'];
    
    if ($action === 'accept') {
        $stmt = $pdo->prepare("UPDATE job_applications SET status = 'accepted' WHERE id = ?");
        $stmt->execute([$applicationId]);
        $message = "Application accepted successfully!";
    } elseif ($action === 'reject') {
        $stmt = $pdo->prepare("UPDATE job_applications SET status = 'rejected' WHERE id = ?");
        $stmt->execute([$applicationId]);
        $message = "Application rejected successfully!";
    }
}

// Fetch pending applications
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
WHERE ja.status = 'pending'
ORDER BY ja.applied_at DESC";

$stmt = $pdo->query($query);
$applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pending Applications - Admin Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
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
            color: #f6932f;
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
        
        .back-btn:hover {
            background: #5568d3;
        }
        
        .message {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: bold;
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
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
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
        }
        
        .match-high {
            background: #d4edda;
            color: #155724;
        }
        
        .match-medium {
            background: #fff3cd;
            color: #856404;
        }
        
        .match-low {
            background: #f8d7da;
            color: #721c24;
        }
        
        .action-btns {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }
        
        .btn:hover {
            transform: scale(1.05);
        }
        
        .btn-accept {
            background: #28a745;
            color: white;
        }
        
        .btn-reject {
            background: #dc3545;
            color: white;
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
            <h1>📋 Pending Applications</h1>
            <a href="admin-dashboard.php" class="back-btn">← Back to Dashboard</a>
        </div>
        
        <?php if (isset($message)): ?>
            <div class="message"><?php echo $message; ?></div>
        <?php endif; ?>
        
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
                            <th>Actions</th>
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
                                    <?php
                                    $score = $app['match_score'];
                                    $class = $score >= 80 ? 'match-high' : ($score >= 60 ? 'match-medium' : 'match-low');
                                    ?>
                                    <span class="match-score <?php echo $class; ?>"><?php echo $score; ?>%</span>
                                </td>
                                <td>
                                    <div class="action-btns">
                                        <form method="POST" style="display: inline;">
                                            <input type="hidden" name="application_id" value="<?php echo $app['id']; ?>">
                                            <input type="hidden" name="action" value="accept">
                                            <button type="submit" class="btn btn-accept">✓ Accept</button>
                                        </form>
                                        <form method="POST" style="display: inline;">
                                            <input type="hidden" name="application_id" value="<?php echo $app['id']; ?>">
                                            <input type="hidden" name="action" value="reject">
                                            <button type="submit" class="btn btn-reject">✗ Reject</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">
                    <p>🎉 No pending applications!</p>
                    <p style="font-size: 14px; margin-top: 10px; color: #999;">All applications have been reviewed.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
