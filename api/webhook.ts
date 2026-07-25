import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runBdrAgent } from '../src/agent/bdrAgent';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        let emailContent = '';
        
        // Handle raw text or JSON body
        if (typeof req.body === 'string') {
            emailContent = req.body;
        } else if (req.body && typeof req.body === 'object') {
            emailContent = JSON.stringify(req.body);
        }

        if (!emailContent) {
            return res.status(400).send('Email content is required');
        }

        console.log('Received inbound email webhook. Starting BDR Agent...');
        
        // Execute the agent flow
        const resultMarkdown = await runBdrAgent(emailContent);
        
        // Return the final markdown text directly for the frontend to render
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        return res.status(200).send(resultMarkdown);

    } catch (error: any) {
        console.error('Error executing BDR Agent:', error);
        return res.status(500).send(`Internal server error: ${error.message}`);
    }
}
