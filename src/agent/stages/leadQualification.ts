import Groq from 'groq-sdk';
import { z } from 'zod';

const MeddpiccSchema = z.object({
    meddpicc: z.object({
        metrics: z.string().describe("Quantifiable measures of value (Known/Unknown)"),
        economic_buyer: z.string().describe("Person with budget authority (Known/Unknown)"),
        decision_criteria: z.string().describe("Criteria used to compare options (Known/Unknown)"),
        decision_process: z.string().describe("Process for evaluation and selection (Known/Unknown)"),
        paper_process: z.string().describe("Legal/Procurement process (Known/Unknown)"),
        identify_pain: z.string().describe("The core problem to solve (Known/Unknown)"),
        champion: z.string().describe("Internal advocate (Known/Unknown)"),
        competition: z.string().describe("Other vendors or status quo (Known/Unknown)")
    }),
    fit_assessment: z.string().describe("Summary of how well the prospect fits the ideal customer profile"),
    priority_score: z.number().min(1).max(10).describe("Priority score from 1 to 10"),
    priority_reasoning: z.string().describe("Justification for the priority score")
});

export type QualificationResult = z.infer<typeof MeddpiccSchema>;

export async function performLeadQualification(emailContent: string): Promise<QualificationResult> {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are an expert BDR (Business Development Representative) Lead Qualification Agent. Your task is to analyze inbound emails and extract qualification data using the MEDDPICC framework.

Analyze the provided email payload and extract all knowns and unknowns for each MEDDPICC category based STRICTLY on the text provided. Do not hallucinate.
Assess the overall fit based on the provided context, and assign a priority score from 1 to 10 (10 being highest priority, representing immediate revenue potential and strong fit), along with a reasoning for the score.

Return ONLY a raw, valid JSON object (no markdown, no extra text) matching this EXACT schema:
{
  "meddpicc": {
    "metrics": "string",
    "economic_buyer": "string",
    "decision_criteria": "string",
    "decision_process": "string",
    "paper_process": "string",
    "identify_pain": "string",
    "champion": "string",
    "competition": "string"
  },
  "fit_assessment": "string",
  "priority_score": number,
  "priority_reasoning": "string"
}`
            },
            {
                role: "user",
                content: emailContent
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0,
    });

    const content = response.choices[0].message?.content;
    if (!content) {
        throw new Error("Failed to get response from Groq");
    }

    try {
        const parsed = JSON.parse(content);
        return MeddpiccSchema.parse(parsed);
    } catch (error) {
        console.error("Failed to parse Groq response:", content);
        throw error;
    }
}
