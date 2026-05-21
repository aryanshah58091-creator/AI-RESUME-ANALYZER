# 🛡️ Career Connect — Admin Module Documentation

> **All-in-one reference** for the admin panel: access, features, pages, database, and troubleshooting.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Access & Login](#access--login)
3. [File Structure](#file-structure)
4. [Pages & Features](#pages--features)
   - [Login Page](#1-login-page)
   - [Dashboard](#2-dashboard)
   - [Pending Applications](#3-pending-applications)
   - [Accepted Applications](#4-accepted-applications)
   - [Manage Jobs](#5-manage-jobs)
   - [Manage Users](#6-manage-users)
5. [Database Tables Used](#database-tables-used)
6. [How Authentication Works](#how-authentication-works)
7. [Changing Admin Credentials](#changing-admin-credentials)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The **Admin Panel** is a separate, standalone PHP-based system for Career Connect administrators. It is **completely independent** from the main React frontend — it has its own login, its own session, and its own pages. Regular users cannot access it.

**Tech Stack:** PHP + MySQL (PDO) + HTML/CSS — no framework required.

---

## Access & Login

| Item | Value |
|------|-------|
| **Admin Panel URL** | `http://localhost/resume-api/admin-login.php` |
| **Dashboard URL** | `http://localhost/resume-api/admin-dashboard.php` |
| **Default Username** | `admin` |
| **Default Password** | `admin123` |

> ⚠️ **Important:** Change the default credentials before deploying to production. See [Changing Admin Credentials](#changing-admin-credentials).

---

## File Structure

All admin files live inside `C:\xampp\htdocs\resume-api\`:

```
resume-api/
├── admin-login.php          ← Login page (entry point)
├── admin-logout.php         ← Destroys session & redirects to login
├── admin-dashboard.php      ← Main dashboard with stats & navigation
├── admin-pending.php        ← Review & action pending applications
├── admin-accepted.php       ← View all accepted applications
├── admin-jobs.php           ← Add / Edit / Delete job listings
├── admin-users.php          ← View all registered users
└── backend/
    └── config/
        └── database.php     ← Shared DB connection (used by all admin pages)
```

---

## Pages & Features

### 1. Login Page
**URL:** `http://localhost/resume-api/admin-login.php`

- Simple username + password form
- Uses PHP `$_SESSION` to track login state
- On success → redirects to **Dashboard**
- On failure → shows error message
- Credentials are hardcoded in `admin-login.php` (line 11)

---

### 2. Dashboard
**URL:** `http://localhost/resume-api/admin-dashboard.php`

The central hub. Shows **4 live stat cards** and **navigation cards** to all sections.

| Stat Card | What it shows |
|-----------|--------------|
| Pending Applications | Count of `job_applications` with `status = 'pending'` |
| Accepted Applications | Count of `job_applications` with `status = 'accepted'` |
| Total Users | Count of all rows in `users` table |
| Total Jobs | Count of all rows in `jobs` table |

**Navigation Cards (clickable):**
- 📋 Pending Applications → `admin-pending.php`
- ✅ Accepted Applications → `admin-accepted.php`
- 👥 Manage Users → `admin-users.php`
- 💼 Manage Jobs → `admin-jobs.php`

---

### 3. Pending Applications
**URL:** `http://localhost/resume-api/admin-pending.php`

Shows all job applications where `status = 'pending'`.

**Columns displayed:**
- Student Name, Email
- Company Name, Job Role
- Applied Date
- Match Score (color-coded: 🟢 ≥80%, 🟡 60–79%, 🔴 <60%)
- Actions

**Actions available per application:**
| Button | What it does |
|--------|-------------|
| ✓ Accept | Sets `status = 'accepted'` in `job_applications` |
| ✗ Reject | Sets `status = 'rejected'` in `job_applications` |

Both actions use a `POST` form and refresh the page with a success message.

---

### 4. Accepted Applications
**URL:** `http://localhost/resume-api/admin-accepted.php`

Read-only view of all applications with `status = 'accepted'`.

**Shows 3 summary stats at the top:**
- Total Candidates accepted
- Unique Companies represented
- Average Match Score (%)

**Columns:** Student Name, Email, Company, Job Role, Applied Date, Match Score, Status badge.

---

### 5. Manage Jobs
**URL:** `http://localhost/resume-api/admin-jobs.php`

Full **CRUD** (Create, Read, Update, Delete) for job listings.

#### ➕ Add a Job
Fill in the form at the top of the page:

| Field | Required | Example |
|-------|----------|---------|
| Job Title | ✅ Yes | `Software Engineer` |
| Company Name | ✅ Yes | `Google` |
| Location | No | `Remote / New York, NY` |
| Salary Range | No | `$80,000 - $120,000` |
| Required Skills | No | `PHP, MySQL, JavaScript` |
| Description | No | Full job description text |

Click **➕ Add Job** to save.

#### ✏️ Edit a Job
Click the **✏️ Edit** button on any row → the form pre-fills with that job's data → make changes → click **💾 Update Job**.

#### 🗑️ Delete a Job
Click **🗑️ Delete** on any row → confirmation prompt appears → confirms deletion.

> ⚠️ Deleting a job also **deletes all applications** for that job (to avoid foreign key errors).

---

### 6. Manage Users
**URL:** `http://localhost/resume-api/admin-users.php`

Read-only view of all registered users (from the main app).

**Columns:** ID, Name, Email, Joined Date

> This is view-only — user deletion/editing is not currently implemented.

---

## Database Tables Used

The admin panel reads/writes to these tables in the `resume_analyzer` MySQL database:

### `users`
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | User ID |
| `name` | VARCHAR | Full name |
| `email` | VARCHAR | Email address |
| `created_at` | DATETIME | Registration date |

### `jobs`
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Job ID |
| `job_title` | VARCHAR | Job title |
| `company_name` | VARCHAR | Company name |
| `description` | TEXT | Job description |
| `required_skills` | TEXT | Comma-separated skills |
| `location` | VARCHAR | Job location |
| `salary_range` | VARCHAR | Salary range string |
| `created_at` | DATETIME | Date posted |

### `job_applications`
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Application ID |
| `user_id` | INT (FK → users) | Applicant |
| `job_id` | INT (FK → jobs) | Applied job |
| `status` | ENUM | `pending` / `accepted` / `rejected` |
| `match_score` | INT | AI match score (0–100) |
| `applied_at` | DATETIME | Application date |

---

## How Authentication Works

The admin panel uses **PHP Sessions** — completely separate from the main app's JWT tokens.

```
1. Admin visits admin-login.php
2. Submits username + password
3. PHP checks hardcoded credentials
4. On match → $_SESSION['admin_logged_in'] = true
5. Every protected page checks this session at the top:
   if (!isset($_SESSION['admin_logged_in'])) → redirect to login
6. admin-logout.php → session_destroy() → redirect to login
```

**Session is stored server-side** — users cannot forge it from the browser.

---

## Changing Admin Credentials

Open `C:\xampp\htdocs\resume-api\admin-login.php` and find **line 11**:

```php
if ($username === 'admin' && $password === 'admin123') {
```

Change `'admin'` and `'admin123'` to your desired credentials:

```php
if ($username === 'your_username' && $password === 'your_strong_password') {
```

Save the file. No restart needed — changes take effect immediately.

> 💡 **For production:** Store credentials in a database with hashed passwords using `password_hash()` / `password_verify()`.

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `404 Not Found` on any admin page | File missing from htdocs | Ensure all `admin-*.php` files are in `C:\xampp\htdocs\resume-api\` |
| Redirected to login on every visit | Session not persisting | Make sure Apache is running and cookies are enabled in browser |
| `Database connection failed` | MySQL not running | Start MySQL from XAMPP Control Panel |
| `Table not found` error | Tables not created | Import `database.sql` in phpMyAdmin → `resume_analyzer` database |
| Wrong credentials error | Typo or changed password | Check `admin-login.php` line 11 for current credentials |
| Stats show 0 on dashboard | Empty database | Add jobs via admin-jobs.php; users register via main app |
| Can't delete a job | FK constraint | The admin-jobs.php delete action handles this automatically |

---

## Quick Access URLs Summary

| Page | URL |
|------|-----|
| 🔐 Login | http://localhost/resume-api/admin-login.php |
| 🎯 Dashboard | http://localhost/resume-api/admin-dashboard.php |
| 📋 Pending Applications | http://localhost/resume-api/admin-pending.php |
| ✅ Accepted Applications | http://localhost/resume-api/admin-accepted.php |
| 💼 Manage Jobs | http://localhost/resume-api/admin-jobs.php |
| 👥 Manage Users | http://localhost/resume-api/admin-users.php |
| 🚪 Logout | http://localhost/resume-api/admin-logout.php |

---

*Last updated: February 2026 | Career Connect Admin Module*
