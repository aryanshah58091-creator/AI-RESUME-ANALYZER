import express from 'express';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { generateInterviewQuestions, evaluateAnswer } from '../services/aiService.js';

const router = express.Router();

// Generate questions based on resume & target role
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { resume_text, target_role } = req.body;
    const resumeText = resume_text || 'Software Engineer with experience in React, Node.js, REST APIs, and databases.';
    const targetRole = target_role || 'Full Stack Engineer';

    const questions = await generateInterviewQuestions(resumeText, targetRole);

    res.json({
      success: true,
      targetRole,
      questions,
    });
  } catch (error) {
    console.error('Generate interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview questions: ' + error.message,
    });
  }
});

// Evaluate a candidate's answer in real-time
router.post('/evaluate', authenticate, async (req, res) => {
  try {
    const { question, answer, keyTopics } = req.body;

    if (!question || !answer || answer.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid question and candidate answer required.',
      });
    }

    const userId = req.user?.id || 1;
    let remainingCredits = null;

    // Check and deduct AI credits (10 credits per AI evaluation)
    try {
      const [uRows] = await pool.query('SELECT ai_credits FROM users WHERE id = ?', [userId]);
      const currentCredits = uRows[0]?.ai_credits !== undefined && uRows[0]?.ai_credits !== null
        ? Number(uRows[0].ai_credits)
        : 100;

      if (currentCredits < 10) {
        return res.status(402).json({
          success: false,
          outOfCredits: true,
          message: 'Insufficient AI credits (10 credits required for AI interview evaluation). Please refill your credits.',
          ai_credits: currentCredits,
        });
      }

      await pool.query('UPDATE users SET ai_credits = GREATEST(0, ai_credits - 10) WHERE id = ?', [userId]);
      remainingCredits = Math.max(0, currentCredits - 10);
    } catch (creditErr) {
      console.warn('Credits balance check warning in interview (proceeding):', creditErr.message);
    }

    const evaluation = await evaluateAnswer(question, answer, keyTopics || []);

    res.json({
      success: true,
      evaluation,
      ai_credits: remainingCredits !== null ? remainingCredits : undefined,
    });
  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Evaluation failed: ' + error.message,
    });
  }
});

// Save completed interview session
router.post('/save-session', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { resume_id, target_role, questions, evaluations, overall_score } = req.body;

    const validResumeId = Number(resume_id) && !isNaN(Number(resume_id)) ? Number(resume_id) : null;
    const [result] = await pool.query(
      `INSERT INTO interview_sessions (user_id, resume_id, target_role, questions, evaluations, overall_score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        validResumeId,
        target_role || 'Software Engineer',
        JSON.stringify(questions || []),
        JSON.stringify(evaluations || []),
        overall_score || 0,
      ]
    );

    res.json({
      success: true,
      sessionId: result.insertId,
    });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ success: false, message: 'Failed to save session' });
  }
});

// Get interview history
router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const [rows] = await pool.query(
      `SELECT id, target_role, overall_score, created_at
       FROM interview_sessions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json({ success: true, history: rows });
  } catch (error) {
    console.error('Interview history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interview history' });
  }
});

export default router;
