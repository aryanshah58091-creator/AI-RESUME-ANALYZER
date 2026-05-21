<?php
session_start();

if (isset($_SESSION['recruiter_logged_in']) && $_SESSION['recruiter_logged_in'] === true) {
    header('Location: recruiter-dashboard.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$error   = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = trim($_POST['name']     ?? '');
    $email    = trim($_POST['email']    ?? '');
    $company  = trim($_POST['company']  ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$name || !$email || !$company || !$password) {
        $error = 'All fields are required.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } else {
        $db = Database::getInstance()->getConnection();

        // Check duplicate
        $check = $db->prepare("SELECT id FROM recruiters WHERE email = :email");
        $check->execute([':email' => $email]);
        if ($check->fetch()) {
            $error = 'An account with this email already exists. Please login.';
        } else {
            $hashed = password_hash($password, PASSWORD_BCRYPT);
            $stmt   = $db->prepare(
                "INSERT INTO recruiters (name, email, password, company_name) VALUES (:name, :email, :password, :company)"
            );
            $stmt->execute([':name' => $name, ':email' => $email, ':password' => $hashed, ':company' => $company]);
            $rid = $db->lastInsertId();

            // Auto-login
            $_SESSION['recruiter_logged_in'] = true;
            $_SESSION['recruiter_id']        = $rid;
            $_SESSION['recruiter_name']      = $name;
            $_SESSION['recruiter_email']     = $email;
            $_SESSION['recruiter_company']   = $company;
            header('Location: recruiter-dashboard.php');
            exit();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recruiter Registration – Career Connect</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%);
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            padding: 30px 20px;
        }

        .card {
            background: white; border-radius: 24px;
            padding: 48px 40px; width: 100%; max-width: 460px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.35);
        }

        .header { text-align: center; margin-bottom: 32px; }

        .icon {
            width: 72px; height: 72px; border-radius: 20px;
            background: linear-gradient(135deg, #059669, #10b981);
            display: flex; align-items: center; justify-content: center;
            font-size: 36px; margin: 0 auto 18px;
            box-shadow: 0 8px 24px rgba(16,185,129,0.4);
        }

        .header h1 { font-size: 26px; font-weight: 800; color: #064e3b; margin-bottom: 6px; }
        .header p  { color: #6b7280; font-size: 14px; }

        .form-group { margin-bottom: 18px; }

        .form-group label {
            display: block; font-weight: 600; color: #374151;
            margin-bottom: 7px; font-size: 14px;
        }

        .form-group input {
            width: 100%; padding: 12px 16px;
            border: 2px solid #e5e7eb; border-radius: 12px;
            font-size: 15px; font-family: inherit;
            transition: border-color .25s, box-shadow .25s; color: #111827;
        }

        .form-group input:focus {
            outline: none; border-color: #10b981;
            box-shadow: 0 0 0 4px rgba(16,185,129,0.12);
        }

        .error {
            background: #fef2f2; color: #991b1b;
            border: 1px solid #fca5a5; border-radius: 10px;
            padding: 13px 16px; margin-bottom: 18px;
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

        .links { margin-top: 22px; text-align: center; }
        .links a { color: #059669; text-decoration: none; font-weight: 600; font-size: 14px; }
        .links a:hover { text-decoration: underline; }
        .links p { color: #9ca3af; font-size: 14px; }
        hr { border: none; border-top: 1px solid #f3f4f6; margin: 18px 0; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div class="icon">🏢</div>
            <h1>Create Recruiter Account</h1>
            <p>Start posting jobs and finding the best talent today</p>
        </div>

        <?php if ($error): ?>
            <div class="error">⚠️ <?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="Jane Smith" required
                    value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label for="email">Work Email</label>
                <input type="email" id="email" name="email" placeholder="jane@company.com" required
                    value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label for="company">Company Name</label>
                <input type="text" id="company" name="company" placeholder="Acme Corp" required
                    value="<?php echo htmlspecialchars($_POST['company'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label for="password">Password <span style="color:#9ca3af;font-weight:400">(min 6 chars)</span></label>
                <input type="password" id="password" name="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn">🚀 Create Account &amp; Start Hiring</button>
        </form>

        <div class="links">
            <hr>
            <p>Already have an account? <a href="recruiter-login.php">Sign In</a></p>
        </div>
    </div>
</body>
</html>
