// server/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from Vite build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // For SPA client-side routing, serve index.html for unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Learning System API is running' });
});

// --- Ask Doubt endpoint ---
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert educational assistant. Answer the following question clearly with examples if helpful.

Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error in /api/ask:', error);
    res.status(500).json({ error: 'Failed to process your question. Please try again.' });
  }
});

// --- Summarize endpoint ---
app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text content is required for summarization' });
    }
    if (text.length < 100) {
      return res.status(400).json({ error: 'Text must be at least 100 characters long' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Summarize the following text with main points and a concise paragraph:

Text:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary, originalLength: text.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error in /api/summarize:', error);
    res.status(500).json({ error: 'Failed to generate summary. Please try again.' });
  }
});

// --- Quiz Generator endpoint ---
app.post('/api/quiz', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text content is required to generate quiz questions' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Based on the content below, create 5 multiple-choice questions in JSON format:

Content:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text_response = response.text();

    // Clean up JSON
    text_response = text_response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const questions = JSON.parse(text_response);
      res.json({ questions, totalQuestions: questions.length, timestamp: new Date().toISOString() });
    } catch {
      res.status(500).json({ error: 'Failed to parse generated quiz JSON.' });
    }
  } catch (error) {
    console.error('Error in /api/quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions. Please try again.' });
  }
});

// --- Learning Roadmap endpoint ---
app.post('/api/roadmap', async (req, res) => {
  try {
    const { topic, level = 'beginner' } = req.body;
    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'Learning topic is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Create a learning roadmap for "${topic}" at ${level} level in JSON format with 5-7 steps.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text_response = response.text();

    text_response = text_response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const roadmap = JSON.parse(text_response);
      res.json({ ...roadmap, timestamp: new Date().toISOString() });
    } catch {
      res.status(500).json({ error: 'Failed to parse generated roadmap JSON.' });
    }
  } catch (error) {
    console.error('Error in /api/roadmap:', error);
    res.status(500).json({ error: 'Failed to generate learning roadmap. Please try again.' });
  }
});

// Catch-all 404
// Use app.use without a path so Express doesn't try to compile a '*' route
// into path-to-regexp (older path-to-regexp versions may throw on '*').
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Learning System API running on port ${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});

export default app;
