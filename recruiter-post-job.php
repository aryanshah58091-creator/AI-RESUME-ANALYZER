<?php
session_start();

if (!isset($_SESSION['recruiter_logged_in']) || $_SESSION['recruiter_logged_in'] !== true) {
    header('Location: recruiter-login.php');
    exit();
}

require_once __DIR__ . '/backend/config/database.php';

$db      = Database::getInstance()->getConnection();
$rid     = $_SESSION['recruiter_id'];
$message = '';
$error   = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title      = trim($_POST['job_title']        ?? '');
    $company    = trim($_POST['company_name']     ?? '');
    $location   = trim($_POST['location']         ?? '');
    $salary     = trim($_POST['salary_range']     ?? '');
    $skills     = trim($_POST['required_skills']  ?? '');
    $desc       = trim($_POST['description']      ?? '');
    $jobType    = trim($_POST['job_type']         ?? 'full-time');
    $expLevel   = trim($_POST['experience_level'] ?? 'mid');

    if (!$title || !$company || !$location || !$skills || !$desc) {
        $error = 'Please fill in all required fields.';
    } else {
        $stmt = $db->prepare(
            "INSERT INTO jobs (job_title, company_name, location, salary_range, required_skills,
                               description, job_type, experience_level, recruiter_id, status)
             VALUES (:title, :company, :location, :salary, :skills, :desc, :jtype, :exp, :rid, 'active')"
        );
        $stmt->execute([
            ':title'   => $title, ':company'  => $company, ':location' => $location,
            ':salary'  => $salary, ':skills'  => $skills,  ':desc'     => $desc,
            ':jtype'   => $jobType, ':exp'    => $expLevel, ':rid'     => $rid,
        ]);
        $message = "✅ Job \"" . htmlspecialchars($title) . "\" posted successfully!";
        // Clear form
        $_POST = [];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Post a Job – Recruiter Panel</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%);
            min-height: 100vh; padding: 24px;
        }

        .container { max-width: 820px; margin: 0 auto; }

        .header {
            background: white; padding: 18px 26px; border-radius: 16px;
            margin-bottom: 22px; box-shadow: 0 8px 24px rgba(0,0,0,0.18);
            display: flex; justify-content: space-between; align-items: center;
        }

        .header h1 { font-size: 22px; font-weight: 800; color: #064e3b; }

        .btn {
            padding: 10px 20px; border: none; border-radius: 10px;
            font-size: 14px; font-weight: 600; cursor: pointer;
            text-decoration: none; display: inline-block;
            font-family: inherit; transition: transform .2s;
        }

        .btn-back { background: #f3f4f6; color: #374151; }
        .btn-back:hover { background: #e5e7eb; }

        .card {
            background: white; border-radius: 18px; padding: 36px 32px;
            box-shadow: 0 12px 36px rgba(0,0,0,0.2);
        }

        .card-title {
            font-size: 19px; font-weight: 800; color: #064e3b;
            margin-bottom: 24px; padding-bottom: 14px;
            border-bottom: 2px solid #d1fae5;
        }

        .msg-success {
            background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;
            border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;
            font-weight: 600; font-size: 15px;
        }

        .msg-error {
            background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5;
            border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;
            font-weight: 600; font-size: 14px;
        }

        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }

        .form-group { margin-bottom: 0; }

        .form-group label {
            display: block; font-weight: 600; color: #374151;
            margin-bottom: 7px; font-size: 14px;
        }

        .form-group label span { color: #6b7280; font-weight: 400; }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%; padding: 12px 15px;
            border: 2px solid #e5e7eb; border-radius: 11px;
            font-size: 15px; font-family: inherit; color: #111827;
            transition: border-color .25s, box-shadow .25s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none; border-color: #10b981;
            box-shadow: 0 0 0 4px rgba(16,185,129,0.12);
        }

        .form-group textarea { resize: vertical; min-height: 130px; }

        .full { grid-column: 1 / -1; margin-bottom: 18px; }

        .form-footer {
            display: flex; gap: 14px; align-items: center; margin-top: 8px;
        }

        .btn-submit {
            flex: 1; padding: 15px;
            background: linear-gradient(135deg, #059669, #10b981);
            color: white; border: none; border-radius: 12px;
            font-size: 16px; font-weight: 700; cursor: pointer;
            font-family: inherit;
            box-shadow: 0 6px 18px rgba(16,185,129,0.4);
            transition: transform .2s, box-shadow .2s;
        }

        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(16,185,129,0.5); }

        .btn-jobs {
            padding: 15px 22px; background: #f0fdf4; color: #059669;
            border: 2px solid #10b981; border-radius: 12px;
            font-size: 15px; font-weight: 600; cursor: pointer;
            text-decoration: none; display: inline-block;
            transition: background .2s;
        }

        .btn-jobs:hover { background: #d1fae5; }

        @media (max-width: 600px) { .row { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Post a New Job</h1>
            <a href="recruiter-dashboard.php" class="btn btn-back">← Back to Dashboard</a>
        </div>

        <div class="card">
            <div class="card-title">📝 Job Details</div>

            <?php if ($message): ?>
                <div class="msg-success"><?php echo $message; ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="msg-error">⚠️ <?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="row">
                    <div class="form-group">
                        <label for="job_title">Job Title <span>*</span></label>
                        <input type="text" id="job_title" name="job_title" placeholder="e.g. Senior React Developer"
                            required value="<?php echo htmlspecialchars($_POST['job_title'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="company_name">Company Name <span>*</span></label>
                        <input type="text" id="company_name" name="company_name"
                            placeholder="<?php echo htmlspecialchars($_SESSION['recruiter_company']); ?>"
                            required value="<?php echo htmlspecialchars($_POST['company_name'] ?? $_SESSION['recruiter_company']); ?>">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label for="location">Location <span>*</span></label>
                        <input type="text" id="location" name="location" placeholder="e.g. Remote / Mumbai"
                            required value="<?php echo htmlspecialchars($_POST['location'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="salary_range">Salary Range <span style="color:#9ca3af">(optional)</span></label>
                        <input type="text" id="salary_range" name="salary_range" placeholder="e.g. ₹8L–12L pa"
                            value="<?php echo htmlspecialchars($_POST['salary_range'] ?? ''); ?>">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label for="job_type">Job Type</label>
                        <select id="job_type" name="job_type">
                            <?php foreach (['full-time'=>'Full-time','part-time'=>'Part-time','contract'=>'Contract','internship'=>'Internship','freelance'=>'Freelance'] as $v=>$l): ?>
                            <option value="<?php echo $v; ?>" <?php echo (($_POST['job_type']??'full-time')===$v)?'selected':''; ?>><?php echo $l; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="experience_level">Experience Level</label>
                        <select id="experience_level" name="experience_level">
                            <?php foreach (['fresher'=>'Fresher (0–1 yr)','junior'=>'Junior (1–3 yrs)','mid'=>'Mid-level (3–5 yrs)','senior'=>'Senior (5+ yrs)','lead'=>'Lead / Manager'] as $v=>$l): ?>
                            <option value="<?php echo $v; ?>" <?php echo (($_POST['experience_level']??'mid')===$v)?'selected':''; ?>><?php echo $l; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="full">
                    <div class="form-group">
                        <label for="required_skills">Required Skills <span>*</span> <span style="color:#9ca3af;font-weight:400">(comma-separated)</span></label>
                        <input type="text" id="required_skills" name="required_skills"
                            placeholder="React, Node.js, MySQL, REST APIs, Git"
                            required value="<?php echo htmlspecialchars($_POST['required_skills'] ?? ''); ?>">
                    </div>
                </div>

                <div class="full">
                    <div class="form-group">
                        <label for="description">Job Description <span>*</span></label>
                        <textarea id="description" name="description"
                            placeholder="Describe the role, responsibilities, requirements, and any benefits or perks…"
                            required><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
                    </div>
                </div>

                <div class="form-footer">
                    <button type="submit" class="btn-submit">🚀 Post Job Now</button>
                    <a href="recruiter-my-jobs.php" class="btn-jobs">📂 View My Jobs</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
