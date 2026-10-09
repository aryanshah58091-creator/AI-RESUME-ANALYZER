# 🚀 ResumeAI Pro — Next-Gen AI Resume Analyzer & ATS Optimizer

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%2F%20MariaDB-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AI Model](https://img.shields.io/badge/AI-Google%20Gemini%203.8%20Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Render](https://img.shields.io/badge/Deploy-Render%20%2B%20TiDB%20Cloud-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, full-stack AI career platform designed to audit resumes against modern **Applicant Tracking Systems (ATS)**, run real-time semantic gap analyses against target Job Descriptions, rewrite experience bullets using **Google's X-Y-Z formula**, and conduct technical mock interviews.

---

## ✨ Core Platform Modules

### 1. 📥 Multi-Format Ingestion Engine
* High-accuracy `.pdf` and `.docx` text extraction powered by `pdf-parse` and `mammoth`.
* Immediate section segmenting (Contact Info, Summary, Core Skills, Work Experience, Education).
* Multi-profile management allowing candidates to switch between multiple resume variants.

### 2. 🔬 Deep ATS Diagnostics & Audit
* **Real-Time ATS Score Calculation**: Evaluates keyword density, quantifiable impact metrics, passive voice penalties, and formatting hygiene.
* **9-Point Parsing Simulation**: Tests compliance with major ATS algorithms (Workday, Taleo, Greenhouse, Lever).
* **Parity Matrix & Keyword Gap**: Pinpoints missing skills, technical keywords, and competencies required for top-tier roles.

### 3. 🎯 Target-JD Semantic Auto-Tailorer
* **Semantic Parity Analysis**: Compares candidate resumes against real recruiter Job Descriptions (LinkedIn, Indeed, portals).
* **Google X-Y-Z Achievement Restructuring**: Rewrites bullets into:
  > *"Accomplished [X] as measured by [Y], by doing [Z]"*
* **Dual Output Modes**:
  * **📄 Compiled ATS Resume & Export**: Clean, single-column formatted document ready for 1-click clean PDF export.
  * **📝 Full Text / Markdown Buffer**: Raw, editable plain text view with instant clipboard copy and `.txt` download.
  * **⚡ Bullet Diff Studio**: Visual Before vs. After comparison cards highlighting metric additions and injected keywords.

### 4. 🤖 AI Technical Mock Interview
* Generates realistic architectural, problem-solving, system design, and behavioral questions tailored to candidate stack and target roles.
* Interactive answer evaluation with immediate scoring, feedback, and recommended STAR method improvements.

### 5. 🪙 Freemium AI Credits & SaaS Ledger
* **100 Free Initial AI Credits** gifted to every newly registered candidate.
* Persistent database balance tracking in MySQL (`users.ai_credits`).
* Deducts 10 credits per JD Auto-Tailor run.
* Interactive **Credits & Upgrade Store** with credit tiers and an instant sandbox refill option.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router 6 |
| **Backend** | Node.js (ES Modules), Express.js, JWT, Bcrypt.js, CORS |
| **Database** | MySQL / MariaDB (Connection Pooling, Auto-Migrations) |
| **Document Processing** | `pdf-parse`, `mammoth`, `multer` |
| **AI Layer** | Google Gemini 1.5/2.0 API + Built-in Dynamic Semantic NLP Engine |

---

## 📁 Repository Structure

```
├── frontend/                     # Modern React + Vite Application
│   ├── src/
│   │   ├── api/                  # Axios configuration & interceptors
│   │   ├── components/           # UI Components (Cards, Modals, Headers)
│   │   │   ├── ui/               # Reusable atomic design components
│   │   │   └── workspace/        # Workspace layout & CreditsModal
│   │   ├── context/              # AuthContext & WorkspaceContext state
│   │   ├── pages/                # Workspace views (Diagnostics, Tailorer, Interview)
│   │   └── App.jsx               # Application routing & providers
│   ├── package.json
│   └── vite.config.js
│
├── server/                       # Node.js + Express Backend
│   ├── src/
│   │   ├── config/               # Database pool & auto-migrations
│   │   ├── middleware/           # JWT Authentication & role verification
│   │   ├── routes/               # Modular REST endpoints (auth, resume, tailorer)
│   │   ├── services/             # AI service (Gemini + local semantic engine)
│   │   └── server.js             # Express application entrypoint
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── .gitignore                    # Production git ignore definitions
└── README.md                     # Platform documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [XAMPP](https://www.apachefriends.org/) or [MySQL Server](https://dev.mysql.com/downloads/) (Running on port `3306`)

### 1. Clone the Repository
```bash
git clone https://github.com/aryanshah58091-creator/AI-RESUME-ANALYZER.git
cd AI-RESUME-ANALYZER
```

### 2. Configure Environment Variables
Inside the `server/` directory, create a `.env` file based on `.env.example`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=resume_analyzer
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
FRONTEND_URL=http://localhost:5173
```
*(The backend automatically creates the `resume_analyzer` database and all required tables upon first start).*

### 3. Install & Start Backend
```bash
cd server
npm install
node src/server.js
```
*Server runs on [http://localhost:5000](http://localhost:5000)*

### 4. Install & Start Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on [http://localhost:5173](http://localhost:5173)*

---

## 🔑 AI Engine Configuration
The platform supports dual-mode AI generation:
1. **Google Gemini Live Cloud**: Add a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) in `server/.env`.
2. **Local Semantic NLP Engine**: If no API key is provided or if network is offline, the platform automatically utilizes its built-in heuristic semantic engine to parse real resume bullets and synthesize Google X-Y-Z achievements.

---

## 📜 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
