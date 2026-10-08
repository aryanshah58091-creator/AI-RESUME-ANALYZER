import express from 'express';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { tailorResumeForJD } from '../services/aiService.js';

const router = express.Router();

// Generate JD-Tailored Resume & Keyword Parity Analysis
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { resume_text, target_role, job_description, resume_id, company_name } = req.body;

    if (!resume_text || !job_description) {
      return res.status(400).json({
        success: false,
        message: 'Both resume text and target Job Description are required.',
      });
    }

    const role = target_role || 'Software Engineer';
    const userId = req.user?.id || 1;
    let remainingCredits = 90;

    // Check and deduct AI credits
    try {
      const [uRows] = await pool.query('SELECT ai_credits FROM users WHERE id = ?', [userId]);
      const currentCredits = uRows[0]?.ai_credits !== undefined && uRows[0]?.ai_credits !== null
        ? Number(uRows[0].ai_credits)
        : 100;

      if (currentCredits < 10) {
        return res.status(402).json({
          success: false,
          outOfCredits: true,
          message: 'Insufficient AI credits (10 credits required to Auto-Tailor). Please refill your credits.',
          ai_credits: currentCredits,
        });
      }

      await pool.query('UPDATE users SET ai_credits = GREATEST(0, ai_credits - 10) WHERE id = ?', [userId]);
      remainingCredits = Math.max(0, currentCredits - 10);
    } catch (creditErr) {
      console.warn('Credits balance check warning (proceeding):', creditErr.message);
    }

    const tailored = await tailorResumeForJD(resume_text, role, job_description);

    // Save to database
    let savedId = null;
    const validResumeId = Number(resume_id) && !isNaN(Number(resume_id)) ? Number(resume_id) : null;
    try {
      const [result] = await pool.query(
        `INSERT INTO tailored_resumes (user_id, resume_id, target_role, company_name, job_description, tailored_content, ats_score_delta)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          validResumeId,
          role,
          company_name || 'Target Employer',
          job_description,
          JSON.stringify(tailored),
          tailored.projectedAtsDelta || 16,
        ]
      );
      savedId = result.insertId;
    } catch (dbErr) {
      console.warn('DB tailoring save warning:', dbErr.message);
    }

    res.json({
      success: true,
      tailoredId: savedId || Date.now(),
      ai_credits: remainingCredits,
      ...tailored,
    });
  } catch (error) {
    console.error('Tailor resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to tailor resume: ' + error.message,
    });
  }
});

// Get user tailored resumes history
router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const [rows] = await pool.query(
      `SELECT id, target_role, company_name, ats_score_delta, created_at
       FROM tailored_resumes
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json({ success: true, history: rows });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
});

// Get single tailored resume
router.get('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const [rows] = await pool.query(
      `SELECT * FROM tailored_resumes WHERE id = ? AND user_id = ?`,
      [req.params.id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const item = rows[0];
    res.json({
      success: true,
      data: {
        ...item,
        tailored_content:
          typeof item.tailored_content === 'string'
            ? JSON.parse(item.tailored_content)
            : item.tailored_content,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving tailored resume' });
  }
});

export default router;
