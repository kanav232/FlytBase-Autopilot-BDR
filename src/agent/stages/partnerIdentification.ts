export interface GtmMotion {
    motion: string;
    justification: string;
}

export function identifyPartnerMotion(region: string, productComplexity: string, personaTitle: string): GtmMotion {
    let requiresPartner = false;
    let requiresAE = false;

    const complexRegions = ["LATAM", "APAC", "MEA"];
    if (complexRegions.includes(region) || productComplexity === "High") {
        requiresPartner = true;
    }
    
    const enterpriseTitles = ["Head", "VP", "Chief", "Director"];
    if (enterpriseTitles.some(title => personaTitle.includes(title))) {
        requiresAE = true;
    }

    if (requiresAE && requiresPartner) {
        return { 
            motion: "Direct AE + Local Partner", 
            justification: "Enterprise buyer requires direct AE relationship; LATAM region and complex hardware requires local System Integrator." 
        };
    } else if (requiresPartner) {
        return { 
            motion: "Partner Only", 
            justification: "Complex deployment in LATAM requires local integration partner." 
        };
    }
    
    return { 
        motion: "Direct AE Only", 
        justification: "Standard deployment manageable by direct AE." 
    };
}
