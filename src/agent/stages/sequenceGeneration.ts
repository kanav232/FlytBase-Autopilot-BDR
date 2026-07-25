import Groq from 'groq-sdk';
import { QualificationResult } from './leadQualification';

export async function generateSequence(
    emailContent: string,
    qualification: QualificationResult,
    research: string
): Promise<string[]> {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are an elite Enterprise BDR Copywriter. Your task is to draft a 3-step email sequence for an inbound lead.
You have been provided with:

1. The original inbound email:
"""
${emailContent}
"""

2. MEDDPICC qualification data (Focus on unknowns to uncover them):
"""
${JSON.stringify(qualification, null, 2)}
"""

3. Deep account research findings:
"""
${research}
"""

Context & Rules:
- Target Persona: Head of Operations. Tone must be direct, professional, peer-to-peer, and respectful of their time.
- Do NOT use generic templates, fluff, or standard marketing jargon.
- Specifically weave in facts about the Atacama Desert lithium extraction challenges (from research).
- Acknowledge the referral from Anglo American in Email 1.
- Your ultimate goal is to subtly uncover the missing MEDDPICC variables.

Progressive Logic:
- Email 1 (Day 1 - The Value Anchor): Acknowledge their inquiry, mention the Anglo American connection, highlight 1 specific insight about Atacama operations, and ask for a 15-min discovery call to align ahead of their Q3 budget conversation.
- Email 2 (Day 4 - The Deep Dive): Focus on the operational hazards and cost of contracted crews. Share a relevant brief insight or metric about drone automation. Ask a soft question about their current safety/cost metrics to uncover 'Metrics' or 'Identify Pain' depth.
- Email 3 (Day 9 - The Executive Summary): Keep it extremely brief (max 3 sentences). Provide a 1-sentence summary of how drone automation mitigates their specific hazards, and ask if they are still the right person (testing 'Economic Buyer'/'Champion') to lead this initiative.

Return exactly three emails, clearly labeled as "Email 1:", "Email 2:", and "Email 3:". Separate them with "---".`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
    });

    const result = response.choices[0].message?.content || "";
    // Simple split logic based on the prompt's instruction to separate with "---"
    return result.split('---').map(email => email.trim()).filter(email => email.length > 0);
}
