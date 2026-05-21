<?php
session_start();

// Already logged in → go to dashboard
if (isset($_SESSION['recruiter_logged_in']) && $_SESSION['recruiter_logged_in'] === true) {
    header('Location: recruiter-dashboard.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email']    ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($email && $password) {
        $db  = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM recruiters WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $recruiter = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($recruiter && password_verify($password, $recruiter['password'])) {
            $_SESSION['recruiter_logged_in'] = true;
            $_SESSION['recruiter_id']        = $recruiter['id'];
            $_SESSION['recruiter_name']      = $recruiter['name'];
            $_SESSION['recruiter_email']     = $recruiter['email'];
            $_SESSION['recruiter_company']   = $recruiter['company_name'];
            header('Location: recruiter-dashboard.php');
            exit();
        } else {
            $error = 'Invalid email or password. Please try again.';
        }
    } else {
        $error = 'Please enter your email and password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recruiter Login – Career Connect</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .card {
            background: white;
            border-radius: 24px;
            padding: 48px 40px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.35);
        }

        .header { text-align: center; margin-bottom: 36px; }

        .icon {
            width: 72px; height: 72px; border-radius: 20px;
            background: linear-gradient(135deg, #059669, #10b981);
            display: flex; align-items: center; justify-content: center;
            font-size: 36px; margin: 0 auto 18px;
            box-shadow: 0 8px 24px rgba(16,185,129,0.4);
        }

        .header h1 { font-size: 28px; font-weight: 800; color: #064e3b; margin-bottom: 6px; }
        .header p  { color: #6b7280; font-size: 15px; }

        .form-group { margin-bottom: 20px; }

        .form-group label {
            display: block; font-weight: 600; color: #374151;
            margin-bottom: 8px; font-size: 14px;
        }

        .form-group input {
            width: 100%; padding: 13px 16px;
            border: 2px solid #e5e7eb; border-radius: 12px;
            font-size: 15px; font-family: inherit;
            transition: border-color .25s, box-shadow .25s;
            color: #111827;
        }

        .form-group input:focus {
            outline: none; border-color: #10b981;
            box-shadow: 0 0 0 4px rgba(16,185,129,0.12);
        }

        .error {
            background: #fef2f2; color: #991b1b;
            border: 1px solid #fca5a5; border-radius: 10px;
            padding: 13px 16px; margin-bottom: 20px;
            font-size: 14px; font-weight: 500;
        }

        .btn {
            width: 100%; padding: 15px;
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white; border: none; border-radius: 12px;
            font-size: 16px; font-weight: 700; cursor: pointer;
            font-family: inherit;
            transition: transform .2s, box-shadow .2s;
            box-shadow: 0 6px 20px rgba(16,185,129,0.4);
        }

        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(16,185,129,0.5); }
        .btn:active { transform: translateY(0); }

        .links { margin-top: 24px; text-align: center; }
        .links a { color: #059669; text-decoration: none; font-weight: 600; font-size: 14px; }
        .links a:hover { text-decoration: underline; }
        .links p { color: #9ca3af; font-size: 14px; margin-bottom: 6px; }

        .divider { border: none; border-top: 1px solid #f3f4f6; margin: 20px 0; }

        .admin-link {
            display: inline-block; margin-top: 4px;
            color: #6b7280; font-size: 13px;
        }
        .admin-link:hover { color: #374151; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div class="icon">🏢</div>
            <h1>Recruiter Portal</h1>
            <p>Sign in to manage your job listings &amp; applicants</p>
        </div>

        <?php if ($error): ?>
            <div class="error">⚠️ <?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label for="email">Work Email</label>
                <input type="email" id="email" name="email" placeholder="you@company.com" required autofocus
                    value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn">🔑 Sign In to Recruiter Panel</button>
        </form>

        <div class="links">
            <hr class="divider">
            <p>Don't have an account? <a href="recruiter-register.php">Register as Recruiter</a></p>
            <a href="admin-login.php" class="admin-link">← Admin Panel</a>
        </div>
    </div>
</body>
</html>
