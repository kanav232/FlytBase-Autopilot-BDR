import Groq from 'groq-sdk';
import { QualificationResult } from './leadQualification';

export async function matchCaseStudy(qualification: QualificationResult): Promise<string> {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // In a real application, you might use a scraper like Firecrawl or Puppeteer to get this text.
    // Here, we provide mocked case study text for Anglo American drone operations.
    const angloAmericanCaseStudy = `
    Anglo American deployed autonomous drone docks across their large-scale open-pit mines to improve safety and operational efficiency.
    Operating 24/7 in harsh, dusty environments, the automated drone system replaced manual inspection crews who were previously exposed to hazardous conditions.
    The implementation resulted in a 40% reduction in inspection-related safety incidents and significant cost savings over contracted manual labor.
    `;

    const prompt = `You are a Sales Engineering Assistant. You have been provided with:
1. The prospect's context:
"""
${JSON.stringify(qualification, null, 2)}
"""

2. The full text extracted from a case study regarding Anglo American:
"""
${angloAmericanCaseStudy}
"""

Task: Write a highly targeted 3-4 sentence paragraph explaining exactly why this case study is relevant to the prospect's specific use case.
Rules:
- Highlight similarities in the industry (mining/extraction).
- Highlight environmental parallels (harsh environments, massive scale).
- Highlight operational overlap (24/7 autonomous needs, reducing human hazard).
- Keep the tone objective and value-focused. Do not use sales-y language.`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "user", content: prompt }
        ],
        temperature: 0.5,
    });

    return response.choices[0].message?.content || "Case study match could not be generated.";
}
