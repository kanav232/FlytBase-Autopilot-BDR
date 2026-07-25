import { QualificationResult } from './leadQualification';
import { GtmMotion } from './partnerIdentification';

export interface AeHandoffInput {
    emailContent: string;
    qualification: QualificationResult;
    research: string;
    caseStudyMatch: string;
    gtmMotion: GtmMotion;
}

export async function generateAeHandoff(input: AeHandoffInput): Promise<string> {
    const { qualification, caseStudyMatch, gtmMotion } = input;
    const { meddpicc, fit_assessment, priority_score } = qualification;

    // A simple regex to extract Name and Company from the original email to populate the template.
    // In a production system, an LLM or specific parsing library would extract these reliably.
    const nameMatch = input.emailContent.match(/From:\s*(.+?)\s*\(/);
    const companyMatch = input.emailContent.match(/Company:\s*(.+)/);
    const titleMatch = input.emailContent.match(/Title:\s*(.+)/);
    
    const prospectName = nameMatch ? nameMatch[1].trim() : "Unknown Prospect";
    const companyName = companyMatch ? companyMatch[1].trim() : "Unknown Company";
    const prospectTitle = titleMatch ? titleMatch[1].trim() : "Unknown Title";

    // Format Knowns and Unknowns
    const knowns: string[] = [];
    const unknowns: string[] = [];

    for (const [key, value] of Object.entries(meddpicc)) {
        if (value.toLowerCase().includes('unknown')) {
            unknowns.push(`- **${key.replace('_', ' ')}**: ${value}`);
        } else {
            knowns.push(`- **${key.replace('_', ' ')}**: ${value}`);
        }
    }

    const template = `
# 🚀 Inbound Lead Handoff: ${prospectName} - ${companyName}

## 1. Buyer Context
- **Name:** ${prospectName}
- **Title:** ${prospectTitle}
- **Company:** ${companyName}
- **Trigger/Source:** Inbound Email / Webhook

## 2. Qualification Status (MEDDPICC)
- **Priority Score:** ${priority_score} / 10
- **Fit Assessment:** ${fit_assessment}

**Knowns:**
${knowns.length > 0 ? knowns.join('\n') : "None identified"}

**Unknowns to Uncover:**
${unknowns.length > 0 ? unknowns.join('\n') : "None identified"}

## 3. Top Research Highlights (Account Context)
${input.research}

## 4. Recommended Case Study
**Anglo American Match:**
${caseStudyMatch}
🔗 [Link to Case Study](https://flytbase.com/case-studies/anglo-american)

## 5. Suggested Next Steps & GTM Motion
- **GTM Motion:** ${gtmMotion.motion}
- **Justification:** ${gtmMotion.justification}
- **Action:** Review the auto-drafted 3-step sequence in the CRM and approve sending.
`;

    return template.trim();
}
