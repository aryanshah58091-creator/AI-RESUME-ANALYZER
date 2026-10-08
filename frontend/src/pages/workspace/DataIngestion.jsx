import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Card, CardHeader, CardTitle, cn } from '../../components/ui/Card';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  FolderOpen,
  Layers,
  FileUp,
  RefreshCw
} from 'lucide-react';

export default function DataIngestion() {
  const navigate = useNavigate();
  const { resumes, selectResume, fetchResumes } = useWorkspace();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste' | 'existing'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    if (!selectedFile) return;
    const name = (selectedFile.name || '').toLowerCase();
    const isSupported =
      name.endsWith('.pdf') ||
      name.endsWith('.docx') ||
      name.endsWith('.doc') ||
      name.endsWith('.txt');

    if (!isSupported) {
      setError('Please select a PDF, DOCX, or TXT file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'upload' && !file) {
      setError('Please select a resume file to upload.');
      return;
    }

    if (activeTab === 'paste' && !pastedText.trim()) {
      setError('Please paste your resume content before proceeding.');
      return;
    }

    setUploading(true);
    try {
      let res;
      if (activeTab === 'upload') {
        const formData = new FormData();
        formData.append('resume', file);
        if (jobDescription.trim()) {
          formData.append('jobDescription', jobDescription.trim());
        }

        res = await axios.post('/resume/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axios.post('/resume/upload', {
          resumeText: pastedText.trim(),
          fileName: 'Candidate_Resume_Pasted.txt',
          jobDescription: jobDescription.trim(),
        });
      }

      const newId = res.data?._id || res.data?.id;
      await fetchResumes();

      if (newId) {
        selectResume(newId);
      }

      // Step 1 -> Step 2 Redirect: Take the candidate directly to ATS Diagnostics!
      navigate('/workspace/ats-diagnostics');
    } catch (err) {
      console.error('Upload failed:', err);
      setError(
        err.response?.data?.message ||
          'Failed to process resume. Please try again or paste text directly.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSelectExisting = (resumeId) => {
    selectResume(resumeId);
    navigate('/workspace/ats-diagnostics');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-4">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Step 1 &bull; Resume Ingestion Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Enter Your Resume to Launch ATS Diagnostics
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload your document to run instant ATS parser health diagnostics, detect weak bullets,
          and unlock tailored job opportunities.
        </p>
      </div>

      {/* Ingestion Mode Selector */}
      <div className="flex justify-center">
        <div className="flex p-1 bg-dark-800 border border-dark-600 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={cn(
              "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeTab === 'upload'
                ? "bg-brand-green text-dark-900 shadow-neon-green"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Upload className="w-4 h-4" />
            Upload File (PDF / DOCX)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={cn(
              "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeTab === 'paste'
                ? "bg-brand-green text-dark-900 shadow-neon-green"
                : "text-slate-400 hover:text-white"
            )}
          >
            <FileText className="w-4 h-4" />
            Paste Text
          </button>
          {resumes.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('existing')}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                activeTab === 'existing'
                  ? "bg-brand-teal text-dark-900 shadow-neon-teal"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <FolderOpen className="w-4 h-4" />
              Existing Resumes ({resumes.length})
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: File Upload */}
      {activeTab === 'upload' && (
        <Card className="p-6 bg-dark-800/90 border-dark-600 shadow-2xl">
          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3",
                dragActive
                  ? "border-brand-green bg-brand-green/10"
                  : file
                  ? "border-brand-green/60 bg-dark-900/60"
                  : "border-dark-600 hover:border-brand-green/50 bg-dark-900/40"
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelected(e.target.files?.[0])}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />

              <div className="w-14 h-14 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-brand-green shadow-md">
                <FileUp className="w-7 h-7" />
              </div>

              {file ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green" />
                    {file.name}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {(file.size / 1024).toFixed(1)} KB &bull; Click to change file
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">
                    Drag &amp; drop your resume here, or <span className="text-brand-green underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Supports PDF, DOCX, DOC, TXT (up to 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* Optional Target Role Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Target Role or Job Description (Optional)</span>
                <span className="text-[10px] text-slate-500 font-mono">Calibrates ATS keywords</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste a target job description or title (e.g., 'Senior Frontend Engineer at Stripe') to benchmark keyword parity..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-xs text-slate-200 focus:border-brand-green focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-brand-green text-dark-900 py-3 rounded-xl font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-neon-green flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-dark-900" />
                  Running ATS Parser &amp; Diagnostics...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Ingest &amp; Run ATS Diagnostics
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </Card>
      )}

      {/* Tab 2: Paste Text */}
      {activeTab === 'paste' && (
        <Card className="p-6 bg-dark-800/90 border-dark-600 shadow-2xl">
          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Paste Resume Text
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the raw text of your resume (Work Experience, Skills, Education)..."
                rows={10}
                className="w-full p-4 rounded-xl bg-dark-900 border border-dark-600 text-xs font-mono text-slate-200 focus:border-brand-green focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !pastedText.trim()}
              className="w-full bg-brand-green text-dark-900 py-3 rounded-xl font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-neon-green flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-dark-900" />
                  Parsing Resume Text...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Ingest &amp; Run ATS Diagnostics
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </Card>
      )}

      {/* Tab 3: Existing Resumes */}
      {activeTab === 'existing' && (
        <Card className="p-6 bg-dark-800/90 border-dark-600 shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">
              Select an Already Analyzed Profile:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resumes.map((resume) => {
                let atsScore = 80;
                try {
                  const p =
                    typeof resume.analysis === 'string'
                      ? JSON.parse(resume.analysis)
                      : resume.analysis;
                  if (p?.atsScore) atsScore = p.atsScore;
                } catch (e) {}

                return (
                  <div
                    key={resume._id || resume.id}
                    onClick={() => handleSelectExisting(resume._id || resume.id)}
                    className="p-4 rounded-xl bg-dark-900/60 border border-dark-600 hover:border-brand-green cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-brand-green truncate max-w-[220px]">
                        {resume.fileName || 'Resume Document'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Analyzed: {new Date(resume.created_at || resume.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-brand-green">
                          {atsScore}/100
                        </div>
                        <div className="text-[9px] text-slate-500 uppercase">ATS Score</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
