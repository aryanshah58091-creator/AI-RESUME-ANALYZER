# Career Connect - Quick Start Guide

## 🚀 How to Start the Application

Every time you want to run **Career Connect**, follow these simple steps:

---

## ⚡ Quick Start (Recommended)

### Option 1: One-Click Startup

1. **Start MySQL** from XAMPP Control Panel (click "Start" next to MySQL)
2. **Run the startup script**:
   - Double-click `start-app.ps1` in the project folder
   - OR run this command in PowerShell:
     ```powershell
     powershell -ExecutionPolicy Bypass -File "d:\ai resume analyzer\start-app.ps1"
     ```

3. **Done!** Your application will open automatically at http://localhost:5173

---

## 📋 Manual Start (Alternative)

If you prefer to start everything manually:

### Step 1: Start Backend (MySQL)
1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
3. Wait until it shows "Running" (green)

### Step 2: Start Frontend
1. Open **PowerShell** or **Command Prompt**
2. Navigate to the frontend folder:
   ```powershell
   cd "d:\ai resume analyzer\frontend"
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Wait for the message: `Local: http://localhost:5173/`

### Step 3: Open in Browser
- Go to: **http://localhost:5173**

---

## 🌐 Access Points

Once running, you can access:

| Service | URL |
|---------|-----|
| **Frontend (Main App)** | http://localhost:5173 |
| **Backend API** | http://localhost/resume-api/api/ |
| **Database Admin** | http://localhost/phpmyadmin |

---

## 🛑 How to Stop the Application

1. **Stop Frontend**: Press `Ctrl + C` in the terminal running npm
2. **Stop MySQL**: In XAMPP Control Panel, click "Stop" next to MySQL

---

## ⚠️ Troubleshooting

### "MySQL is not running" error
- **Solution**: Start MySQL from XAMPP Control Panel

### "Port 5173 is already in use"
- **Solution**: Another instance is running. Close it or use a different port

### "Cannot connect to backend"
- **Solution**: 
  1. Check MySQL is running
  2. Verify backend files exist at `c:\xampp\htdocs\resume-api`
  3. Check database `resume_analyzer` exists in phpMyAdmin

### Frontend shows blank page
- **Solution**: 
  1. Clear browser cache (Ctrl + Shift + Delete)
  2. Hard refresh (Ctrl + F5)
  3. Check browser console for errors (F12)

---

## 📝 Daily Workflow

```
1. Start XAMPP → Click "Start" on MySQL
2. Run start-app.ps1 (or manually start frontend)
3. Open http://localhost:5173
4. Start coding! 🎉
```

---

## 🔧 Useful Commands

```powershell
# Check if MySQL is running
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;"

# Install/Update dependencies
cd "d:\ai resume analyzer\frontend"
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check the console/terminal for error messages

---

**Happy Coding! 🚀**
