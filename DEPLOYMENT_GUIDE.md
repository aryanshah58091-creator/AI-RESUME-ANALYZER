# 🚀 Complete Deployment Guide: AI Resume Analyzer & Career Platform

This repository is pre-configured for free and production deployment on modern cloud platforms. Follow whichever method you prefer below.

---

## 📋 Required Cloud Services (All Have 100% Free Tiers)

1. **Google Gemini API Key**:
   - Get your free key at: [Google AI Studio](https://aistudio.google.com/)
2. **Cloud MySQL Database**:
   - Since local XAMPP MySQL won't be accessible on the internet, choose any free cloud MySQL provider:
     - **[TiDB Cloud](https://tidbcloud.com/)** (Recommended: Free Forever Serverless tier, 5GB storage, instant connection URI)
     - **[Aiven for MySQL](https://aiven.io/)** (Free tier, managed MySQL)
     - **[Railway MySQL](https://railway.app/)** (1-click built-in MySQL)
     - **[Clever Cloud](https://www.clever-cloud.com/)** (Free MySQL addon)
3. **Hosting Platform**:
   - **Render** (Free Web Services)
   - **Vercel** (Free Frontend hosting)
   - **Railway** (Free trial credits)

---

## ⚡ Method 1: Render All-in-One (Recommended — Fastest & Easiest)

In this setup, a single Render service runs **both** the React frontend and Node.js backend on the exact same domain. You don't have to worry about CORS or managing two separate URLs.

### Step 1: Set Up Free Cloud MySQL
1. Go to [TiDB Cloud](https://tidbcloud.com/) and create a free account.
2. Click **Create Cluster** $\rightarrow$ select **Serverless (Free)**.
3. Click **Connect** $\rightarrow$ choose **General / Connection String**.
4. Copy the MySQL URI. It will look like:
   ```text
   mysql://<username>:<password>@<gateway-host>:4000/<database_name>?ssl={"rejectUnauthorized":true}
   ```

### Step 2: Deploy on Render
1. Push your code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository (`AI-RESUME-ANALYZER`).
4. Configure the service:
   * **Name**: `ai-resume-analyzer`
   * **Runtime**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Plan**: `Free`
5. In **Environment Variables**, add:
   * `NODE_ENV`: `production`
   * `GEMINI_API_KEY`: *(Your Google Gemini API key)*
   * `JWT_SECRET`: *(Any secret string, e.g. `career_connect_jwt_secret_key_2026`)*
   * `DATABASE_URL`: *(Your TiDB or cloud MySQL connection string)*
6. Click **Create Web Service**.
7. Render will build the React app, install backend dependencies, and launch Express.
   * On startup, the backend automatically runs `initDatabase()` to create all 4 tables (`users`, `resumes`, `tailored_resumes`, `interview_sessions`).
8. Done! Your app will be live at `https://<your-service-name>.onrender.com`.

---

## 🌐 Method 2: Vercel (Frontend) + Render (Backend)

If you prefer Vercel for the React frontend:

### Step 1: Deploy Backend to Render
1. Go to [Render](https://dashboard.render.com/) $\rightarrow$ **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository.
3. Configure:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Environment Variables:
   * `GEMINI_API_KEY`: *(Your key)*
   * `JWT_SECRET`: *(Your secret)*
   * `DATABASE_URL`: *(Your cloud MySQL connection string)*
5. Note your Render backend URL (e.g., `https://ai-resume-server.onrender.com`).

### Step 2: Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com/) $\rightarrow$ **Add New Project**.
2. Import your GitHub repository (`AI-RESUME-ANALYZER`).
3. Configure Project:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. In **Environment Variables**, add:
   * `VITE_API_BASE_URL`: `https://ai-resume-server.onrender.com` *(Your Render backend URL)*
5. Click **Deploy**.
6. The `frontend/vercel.json` included in this repo ensures client-side routing works smoothly without 404 errors.

---

## 🚂 Method 3: Railway (All-in-One Dashboard)

1. Go to [Railway.app](https://railway.app/) and create a new project.
2. Click **+ New** $\rightarrow$ **Database** $\rightarrow$ **Add MySQL**.
   * Railway automatically creates a MySQL database and exposes `MYSQL_URL`.
3. In the same project, click **+ New** $\rightarrow$ **GitHub Repo** $\rightarrow$ select your repo.
4. Go to the service **Settings**:
   * Set Build Command to: `npm run build`
   * Set Start Command to: `npm start`
5. Go to **Variables** $\rightarrow$ Add:
   * `DATABASE_URL`: `${{MySQL.MYSQL_URL}}` *(Reference the Railway MySQL database)*
   * `GEMINI_API_KEY`: *(Your Gemini key)*
   * `JWT_SECRET`: `your_random_secret_string`
6. Click **Generate Domain** under Networking. Your application is live!

---

## 🔑 Environment Variable Reference

| Variable | Description | Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key | `AQ.Ab8RN6...` |
| `DATABASE_URL` / `MYSQL_URL` | Cloud MySQL connection string | `mysql://user:pass@host:3306/db?ssl=...` |
| `JWT_SECRET` | Secret key for JWT auth tokens | `super_secret_jwt_key_2026` |
| `VITE_API_BASE_URL` | Backend URL (only needed if frontend is hosted on separate domain) | `https://ai-resume-server.onrender.com` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Web server port (auto-set by Render/Railway) | `5000` / `10000` |

---

## 🗄️ Database Auto-Migration Note
When the server starts in the cloud, `initDatabase()` in `server/src/config/db.js` automatically creates:
* `users` (with credits, roles, and sandbox 1-time limit flags)
* `resumes`
* `tailored_resumes`
* `interview_sessions`

You do not need to manually run SQL scripts on your cloud database.
If you wish to import previous test data, you can import `server/backup_resume_analyzer.sql` using MySQL Workbench or the cloud console.
