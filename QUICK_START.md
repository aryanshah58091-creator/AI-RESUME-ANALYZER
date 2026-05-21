# 🚀 Career Connect - Startup Instructions

## ⚡ EASIEST WAY TO START (Recommended)

### Every time you want to run the application:

1. **Start MySQL**
   - Open **XAMPP Control Panel**
   - Click **Start** next to **MySQL**
   - Wait for green "Running" status

2. **Start the Application**
   - **Double-click** `START_APP.bat` in the project folder
   - OR run in PowerShell:
     ```powershell
     .\start-app.ps1
     ```

3. **Open Your Browser**
   - Go to: **http://localhost:5173**
   - Login and start using Career Connect! 🎉

---

## 📁 Important Files Created

| File | Purpose |
|------|---------|
| `START_APP.bat` | **Double-click this** to start everything |
| `start-app.ps1` | Automated startup script (PowerShell) |
| `START_HERE.md` | Detailed startup guide with troubleshooting |
| `.agent/workflows/start-app.md` | Workflow documentation |

---

## 🎯 Quick Reference

### Starting the App
```
1. XAMPP → Start MySQL
2. Double-click START_APP.bat
3. Open http://localhost:5173
```

### Stopping the App
```
1. Press Ctrl+C in the frontend terminal
2. XAMPP → Stop MySQL
```

### Access Points
- **Frontend**: 
- **Backend API**: http://localhost/resume-api/api/
- **Database**: http://localhost/phpmyadmin

---

## 🔧 Manual Method (If Automated Script Fails)

### Terminal 1 - Frontend:
```powershell
cd "d:\ai resume analyzer\frontend"
npm run dev
```

### XAMPP Control Panel:
- Start MySQL

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "MySQL not running" | Start MySQL from XAMPP Control Panel |
| "Port 5173 in use" | Close other instances or restart computer |
| "Can't connect to API" | Verify MySQL is running and backend files exist |
| Blank page | Clear cache (Ctrl+Shift+Del) and refresh (Ctrl+F5) |

---

## 📞 Need More Help?

Read the detailed guide: **START_HERE.md**

---

**Made with ❤️ for easy development**
