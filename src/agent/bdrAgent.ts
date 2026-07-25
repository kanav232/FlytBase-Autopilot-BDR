import { performLeadQualification } from './stages/leadQualification';
import { performAccountResearch } from './stages/accountResearch';
import { generateSequence } from './stages/sequenceGeneration';
import { matchCaseStudy } from './stages/caseStudyMatching';
import { identifyPartnerMotion } from './stages/partnerIdentification';
import { generateAeHandoff } from './stages/aeHandoff';

export async function runBdrAgent(emailContent: string) {
    console.log('--- Stage 1: Lead Qualification ---');
    const qualification = await performLeadQualification(emailContent);
    console.log('Lead Qualification Result:', JSON.stringify(qualification, null, 2));

    // Stop if priority is very low or not a fit
    if (qualification.priority_score < 3) {
        console.log('Priority score too low. Stopping agent flow.');
        return { status: 'rejected', reason: 'Low priority score', qualification };
    }

    const companyName = qualification.meddpicc.identify_pain ? "SQM" : "Unknown Company"; // In a real scenario, we might extract company explicitly, here we know it from context or use a general extraction

    console.log('\n--- Stage 2: Deep Account Research ---');
    const research = await performAccountResearch(companyName); // Or more specific targets
    console.log('Account Research Result:', research);

    console.log('\n--- Stage 3: Response Sequence Generation ---');
    const sequence = await generateSequence(emailContent, qualification, research);
    console.log('Sequence Generated');

    console.log('\n--- Stage 4: Case Study Matching ---');
    const caseStudyMatch = await matchCaseStudy(qualification);
    console.log('Case Study Match Generated');

    console.log('\n--- Stage 5: Partner Identification Motion ---');
    const gtmMotion = identifyPartnerMotion('LATAM', 'High', qualification.meddpicc.economic_buyer || 'Head of Operations');
    console.log('GTM Motion Identified:', gtmMotion);

    console.log('\n--- Stage 6: AE Handoff Summary ---');
    const aeHandoff = await generateAeHandoff({
        emailContent,
        qualification,
        research,
        caseStudyMatch,
        gtmMotion
    });
    
    console.log('Agent flow completed successfully.');
    return {
        status: 'success',
        aeHandoff,
        sequence
    };
}
