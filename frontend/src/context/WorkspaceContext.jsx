import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const WorkspaceContext = createContext(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

const DEFAULT_CANDIDATE = {
  id: 'demo-1',
  fileName: 'Anish_Varma_Resume.txt',
  file_name: 'Anish_Varma_Resume.txt',
  extracted_text: `Anish Varma - Full Stack Software Engineer
Summary: Software engineer with 3+ years building high-throughput distributed applications in React, Node.js, and MySQL. Spearheaded microservices migration and optimized SQL queries reducing p99 latency by 35%.
Skills: React, Node.js, JavaScript, TypeScript, Express, MySQL, REST APIs, Redis, Docker, Git, CI/CD, AWS.
Experience:
- Software Engineer at TechCorp (2022-Present): Architected scalable RESTful microservices; engineered automated CI/CD pipelines; tuned relational database indexes.
- Junior Developer at WebSolutions (2020-2022): Developed full-stack web applications and integrated payment gateways.`,
  analysis: {
    atsScore: 88,
    matchedSkills: ['React', 'Node.js', 'Express', 'MySQL', 'REST APIs', 'Docker', 'Git', 'JavaScript'],
    missingSkills: ['Kubernetes', 'GraphQL', 'AWS Lambda'],
    matchedKeywords: ['architected', 'spearheaded', 'engineered', 'optimized', 'reduced latency', 'scalable'],
    missingKeywords: ['revenue impact', 'cross-functional leadership', 'unit test coverage'],
    strengths: [
      'Strong technical alignment with modern full-stack development',
      'Clean single-column standard section hierarchy compliant with ATS parsers',
      'Demonstrated impact metrics (35% p99 latency reduction)',
    ],
    improvements: [
      'Quantify business revenue/cost impact alongside performance percentages',
      'Add cloud infrastructure architecture accomplishments',
      'Incorporate specific target competencies into the summary block',
    ],
    summary:
      'Candidate demonstrates strong full-stack foundations with high ATS parsing compatibility and quantified engineering achievements.',
  },
  created_at: new Date().toISOString(),
};

export function WorkspaceProvider({ children }) {
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(
    localStorage.getItem('activeResumeId') || ''
  );
  const [loadingResumes, setLoadingResumes] = useState(false);

  const fetchResumes = async () => {
    setLoadingResumes(true);
    try {
      const response = await axios.get('/resume/history');
      const resumesData = Array.isArray(response.data)
        ? response.data
        : response.data?.resumes && Array.isArray(response.data.resumes)
        ? response.data.resumes
        : [];
      
      setResumes(resumesData);

      // If activeResumeId is not set or not in resumes, pick the latest one
      if (resumesData.length > 0) {
        const found = resumesData.find(
          (r) => String(r._id || r.id) === String(activeResumeId)
        );
        if (!found) {
          const latestId = String(resumesData[0]._id || resumesData[0].id);
          setActiveResumeId(latestId);
          localStorage.setItem('activeResumeId', latestId);
        }
      }
    } catch (error) {
      console.warn('Failed to load resume history in workspace, using resilient state:', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const selectResume = (id) => {
    setActiveResumeId(String(id));
    localStorage.setItem('activeResumeId', String(id));
  };

  const effectiveResumes = resumes.length > 0 ? resumes : [DEFAULT_CANDIDATE];

  const activeResume =
    effectiveResumes.find(
      (r) => String(r._id || r.id) === String(activeResumeId)
    ) ||
    effectiveResumes[0] ||
    DEFAULT_CANDIDATE;

  // Parsed analysis object
  let parsedAnalysis = null;
  if (activeResume) {
    try {
      parsedAnalysis =
        typeof activeResume.analysis === 'string'
          ? JSON.parse(activeResume.analysis)
          : activeResume.analysis;
    } catch (e) {
      parsedAnalysis = null;
    }
  }

  return (
    <WorkspaceContext.Provider
      value={{
        resumes,
        activeResume,
        activeResumeId,
        selectResume,
        fetchResumes,
        loadingResumes,
        parsedAnalysis,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
