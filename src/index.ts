import express from 'express';
import dotenv from 'dotenv';
import { runBdrAgent } from './agent/bdrAgent';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.text()); // To handle raw email text

app.post('/webhook/inbound-email', async (req, res) => {
    try {
        const emailContent = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        if (!emailContent) {
            return res.status(400).json({ error: 'Email content is required' });
        }

        console.log('Received inbound email webhook. Starting BDR Agent...');
        const result = await runBdrAgent(emailContent);
        
        return res.status(200).json({
            message: 'BDR Agent execution completed successfully',
            data: result
        });
    } catch (error) {
        console.error('Error executing BDR Agent:', error);
        return res.status(500).json({ error: 'Internal server error during agent execution' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BDR Agent webhook server running on port ${PORT}`);
});
