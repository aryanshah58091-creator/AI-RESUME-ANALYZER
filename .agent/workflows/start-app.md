---
description: How to start the Career Connect application (Frontend + Backend)
---

# Starting Career Connect Application

Follow these steps every time you want to run the application:

## Prerequisites
- XAMPP installed at `C:\xampp`
- Node.js installed
- All dependencies installed (`npm install` already done)

## Step-by-Step Startup Process

### Method 1: Automated Startup (Recommended)

// turbo
1. Run the automated startup script:
```powershell
powershell -ExecutionPolicy Bypass -File "d:\ai resume analyzer\start-app.ps1"
```

This script will:
- Check if MySQL is running
- Start the frontend dev server
- Display all access URLs

### Method 2: Manual Startup

#### Step 1: Start MySQL (Backend Database)
1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
3. Wait until it shows "Running" in green
4. (Optional) Click **Start** next to **Apache** if you want to use phpMyAdmin

#### Step 2: Start Frontend
Open a terminal in the frontend directory and run:
```powershell
cd "d:\ai resume analyzer\frontend"
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## Access Points

Once everything is running:

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost/resume-api/api/
- **phpMyAdmin** (if Apache is running): http://localhost/phpmyadmin

## Stopping the Application

1. **Stop Frontend**: Press `Ctrl+C` in the terminal running `npm run dev`
2. **Stop MySQL**: In XAMPP Control Panel, click **Stop** next to MySQL
3. **Stop Apache** (if running): In XAMPP Control Panel, click **Stop** next to Apache

## Troubleshooting

### Frontend won't start
- Make sure you're in the correct directory: `d:\ai resume analyzer\frontend`
- Run `npm install` if dependencies are missing
- Check if port 5173 is already in use

### Backend API errors
- Verify MySQL is running in XAMPP
- Check database connection in `c:\xampp\htdocs\resume-api\config\database.php`
- Verify the database `resume_analyzer` exists

### "Can't connect to MySQL server" error
- Start MySQL from XAMPP Control Panel
- Check if port 3306 is available
- Restart XAMPP if needed

## Quick Reference Commands

```powershell
# Start frontend
cd "d:\ai resume analyzer\frontend"
npm run dev

# Check if MySQL is running
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;"

# View frontend build
npm run build

# Preview production build
npm run preview
```
