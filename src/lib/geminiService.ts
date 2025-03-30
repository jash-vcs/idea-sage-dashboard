
import { toast } from "sonner";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Store the API key temporarily in memory
let apiKey: string | null = null;

export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem("gemini-api-key", key);
};

export const getApiKey = (): string | null => {
  if (apiKey) return apiKey;
  
  // Try to get from localStorage
  const storedKey = localStorage.getItem("gemini-api-key");
  if (storedKey) {
    apiKey = storedKey;
    return storedKey;
  }
  
  return null;
};

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
}

export const streamGeminiResponse = async (
  prompt: string,
  systemPrompt: string = "",
  onChunk: (text: string) => void,
  onComplete: () => void
) => {
  const key = getApiKey();
  
  if (!key) {
    toast.error("Please set your Gemini API key first");
    return;
  }
  
  const url = `${GEMINI_API_URL}?key=${key}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              ...(systemPrompt ? [{ text: systemPrompt }] : []),
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling Gemini API");
    }
    
    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini");
    }
    
    const text = data.candidates[0].content.parts[0].text;
    
    // Simulate streaming by sending chunks of text
    const chunks = text.split(" ");
    let index = 0;
    
    const intervalId = setInterval(() => {
      if (index < chunks.length) {
        onChunk(chunks[index] + " ");
        index++;
      } else {
        clearInterval(intervalId);
        onComplete();
      }
    }, 30); // Adjust speed as needed
    
    return text;
  } catch (error: any) {
    toast.error(`API Error: ${error.message}`);
    console.error("Gemini API error:", error);
    throw error;
  }
};

export const generateIdeaTitle = async (description: string): Promise<string> => {
  const key = getApiKey();
  
  if (!key) {
    toast.error("Please set your Gemini API key first");
    return "My Startup Idea";
  }
  
  const url = `${GEMINI_API_URL}?key=${key}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Generate a short, catchy title (5 words max) for this startup idea. Return just the title, nothing else:" },
              { text: description }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 20,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling Gemini API");
    }
    
    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini");
    }
    
    return data.candidates[0].content.parts[0].text.trim().replace(/["""]/g, '');
  } catch (error) {
    console.error("Error generating title:", error);
    return "My Startup Idea";
  }
};

export const generateAnalysisWithGemini = async (idea: { title: string, description: string }): Promise<any> => {
  const key = getApiKey();
  
  if (!key) {
    toast.error("Please set your Gemini API key first");
    throw new Error("API key not set");
  }
  
  const url = `${GEMINI_API_URL}?key=${key}`;
  
  const systemPrompt = `
You are an expert startup analyst. Provide a comprehensive, insightful analysis of the following startup idea.
Your response should include these sections:
1. Problem Analysis: Identify the core problem and its significance
2. Target Market: Define the ideal customer segments with specifics
3. Business Model: Suggest viable revenue streams and pricing models
4. Legal Considerations: Highlight key regulatory concerns
5. Growth Strategy: Outline practical steps for scaling
6. Competitor Analysis: Identify main competitors and differentiation points
7. Funding Requirements: Estimate initial funding needs and allocation

Format your response as a clean JSON object with these exact keys: problemAnalysis, targetMarket, businessModel, legalConsiderations, growthStrategy, competitorAnalysis, fundingRequirements.
Each value should be 2-3 paragraphs of insightful analysis. Be specific, practical, and actionable.
`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Idea Title: ${idea.title}\nIdea Description: ${idea.description}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling Gemini API");
    }
    
    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini");
    }
    
    const text = data.candidates[0].content.parts[0].text;
    
    try {
      // Try to extract JSON from the response text
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = text.substring(jsonStart, jsonEnd);
        return JSON.parse(jsonStr);
      } else {
        // Fallback: try to extract the sections manually
        const analysis: any = {};
        const sections = [
          "problemAnalysis", "targetMarket", "businessModel", 
          "legalConsiderations", "growthStrategy", "competitorAnalysis", 
          "fundingRequirements"
        ];
        
        for (const section of sections) {
          const regex = new RegExp(`(?:${section}|${section.replace(/([A-Z])/g, ' $1').trim()})[^\n]*?\n((?:.+\n?)+?)(?:\n\n|$)`, 'i');
          const match = text.match(regex);
          analysis[section] = match ? match[1].trim() : `No ${section} provided`;
        }
        
        return analysis;
      }
    } catch (e) {
      console.error("Error parsing analysis:", e);
      throw new Error("Failed to parse analysis response");
    }
  } catch (error: any) {
    toast.error(`Analysis Generation Error: ${error.message}`);
    console.error("Gemini API error:", error);
    throw error;
  }
};

export const generateChatResponse = async (
  ideaTitle: string,
  ideaDescription: string,
  agentType: string,
  messageHistory: { content: string, isUser: boolean }[],
  userMessage: string
): Promise<string> => {
  const key = getApiKey();
  
  if (!key) {
    toast.error("Please set your Gemini API key first");
    return "I can't respond without an API key. Please set your Gemini API key.";
  }
  
  const url = `${GEMINI_API_URL}?key=${key}`;
  
  const agentPersonalities: Record<string, string> = {
    assistant: "You are a helpful AI assistant that provides clear, concise responses about startup ideas. Focus on giving balanced, practical advice.",
    pitch: "You are a Pitch Expert specialized in helping founders craft compelling pitches. Focus on messaging, storytelling, and presentation techniques.",
    financial: "You are a Financial Analyst who helps founders with business models, pricing strategies, financial projections, and funding plans. Be specific and practical.",
    market: "You are a Market Research Specialist who analyzes target customers, market sizes, trends, and competitive landscapes. Provide data-driven insights.",
    legal: "You are a Legal Consultant who helps founders navigate regulatory requirements, intellectual property, and compliance issues. Be thorough but accessible.",
    growth: "You are a Growth Strategist focused on customer acquisition, retention, and scaling strategies. Provide actionable, measurable advice.",
    fundraising: "You are a Fundraising Coach who helps founders attract investors. Focus on fundraising strategies, investor relationships, and pitch refinement."
  };
  
  const systemPrompt = `
You are acting as a ${agentType} for a startup called "${ideaTitle}".

Idea Description: ${ideaDescription}

${agentPersonalities[agentType] || agentPersonalities.assistant}

Keep your responses helpful, concise (1-3 paragraphs), and actionable. 
Provide specific examples or next steps when possible.
Don't use markdown formatting in your responses.
`;

  try {
    // Format message history for Gemini
    const messagesForGemini = messageHistory.map(msg => ({
      parts: [{ text: msg.content }],
      role: msg.isUser ? "user" : "model"
    }));
    
    // Add the latest user message
    messagesForGemini.push({
      parts: [{ text: userMessage }],
      role: "user"
    });
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }],
            role: "system"
          },
          ...messagesForGemini
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling Gemini API");
    }
    
    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Chat response error:", error);
    return `I'm sorry, I encountered an error: ${error.message}. Please try again.`;
  }
};
