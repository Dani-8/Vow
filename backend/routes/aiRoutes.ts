import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured in secrets.');
        }
        aiClient = new GoogleGenAI({
            apiKey,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build',
                },
            },
        });
    }
    return aiClient;
}


router.post('/task-assist', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { taskTitle, description, tags, endTime, status, userMessage, chatHistory } = req.body;

        if (!taskTitle) {
            return res.status(400).json({ error: 'Task title is required for AI assistance' });
        }

        const ai = getGeminiClient();

        const systemInstruction = `You are Vow AI, an empathetic, supportive, and practical personal growth coach and productivity guide built inside Vow (a soft, non-punitive task & habit tracker).
Your job is to assist users who are struggling with a task or approaching a deadline.

Core Principles:
1. Empathy First: Never judge, shame, or chastise the user. Frame challenges as opportunities for small, achievable wins.
2. Actionable Micro-Steps: Break overwhelming tasks into 2 to 4 tiny 5-to-15 minute micro-steps that require minimal activation energy.
3. Schedule / Reschedule Guidance: Suggest realistic time-blocks or gentle timeline adjustments if the deadline is unrealistic.
4. Clean Formatting: Return markdown with clear bullet points and bold action verbs. Keep your total response under 250 words so it is quick to read.`;

        const now = new Date();
        let timeContext = '';

        if (endTime) {
            const deadline = new Date(endTime);
            const diffMinutes = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60));

            if (diffMinutes < 0) {
                timeContext = `Deadline was ${Math.abs(diffMinutes)} minutes ago.`;
            } else {
                const hours = Math.floor(diffMinutes / 60);
                const mins = diffMinutes % 60;

                timeContext = `Deadline in ${hours > 0 ? `${hours}h ` : ''}${mins}m.`;
            }
        }

        const promptContext = `Task: "${taskTitle}"
Description: ${description || 'None provided'}
Tags: ${Array.isArray(tags) ? tags.join(', ') : 'None'}
Status: ${status || 'todo'}
Time Context: ${timeContext || 'No strict deadline'}

User Message / Question: "${userMessage || 'Help me break down this task and tackle it effectively.'}"`;


        let formattedContents: any[] = [];

        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
            // Build history
            formattedContents = chatHistory.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));
            formattedContents.push({
                role: 'user',
                parts: [{ text: promptContext }],
            });
        } else {
            formattedContents = [{ parts: [{ text: promptContext }] }];
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: formattedContents,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });

        const replyText = response.text || "I'm here to help! Let's break this down into tiny, effortless steps.";

        return res.json({
            reply: replyText,
        });
    } catch (err: any) {
        console.error('AI Assist error:', err);
        
        return res.status(500).json({
            error: err.message || 'Failed to generate AI assistance. Please check your Gemini API Key.',
        });
    }
});

export default router;
