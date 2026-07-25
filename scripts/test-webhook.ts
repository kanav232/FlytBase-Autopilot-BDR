import 'dotenv/config';
import { runBdrAgent } from '../src/agent/bdrAgent';

const sampleEmail = `
From: Rodrigo Castillo (r.castillo@sqm.cl)
Title: Head of Operations, Northern Operations Division
Company: Sociedad Quimica y Minera de Chile (SQM), Chile
Subject: Autonomous inspection for our Atacama lithium sites
Context: Looking for drone-based inspection for 3 large-scale, 24/7 lithium extraction sites in the Atacama Desert. Contracted crews are expensive and hazardous. Referred by Anglo American. Internal budget conversation scheduled for Q3.
`;

async function test() {
    console.log("Starting BDR Agent Test...");
    try {
        const result = await runBdrAgent(sampleEmail);
        
        console.log("\n====================================");
        console.log("FINAL AE HANDOFF DOCUMENT");
        console.log("====================================\n");
        console.log(result.aeHandoff);

        console.log("\n====================================");
        console.log("GENERATED 3-STEP EMAIL SEQUENCE");
        console.log("====================================\n");
        result.sequence?.forEach((email, i) => {
            console.log(`\n--- Email ${i + 1} ---\n`);
            console.log(email);
        });

    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
