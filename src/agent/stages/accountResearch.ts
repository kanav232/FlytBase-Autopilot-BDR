import axios from 'axios';

export async function performAccountResearch(companyContext: string): Promise<string> {
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (!tavilyApiKey) {
        console.warn("TAVILY_API_KEY is missing. Mocking account research.");
        return "Mock Research: SQM is investing heavily in automation. Safety hazards in Atacama involve extreme heat and fatigue for contractors.";
    }

    try {
        const query = `${companyContext} Northern Operations Division Atacama technology capex OR operational hazards OR drone inspection`;
        
        const response = await axios.post('https://api.tavily.com/search', {
            api_key: tavilyApiKey,
            query: query,
            search_depth: "advanced",
            include_answer: true,
            max_results: 3
        });

        if (response.data && response.data.answer) {
            return response.data.answer;
        }

        // Fallback to concatenating snippets if answer is not provided
        const snippets = response.data.results.map((r: any) => r.content).join('\n\n');
        return snippets || "No specific findings from search.";
    } catch (error) {
        console.error("Error during account research with Tavily:", error);
        return "Failed to fetch research due to an error.";
    }
}
