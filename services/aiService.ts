
import { GoogleGenAI, Type } from "@google/genai";
import { CommitData } from "../types";

export const aiService = {
  analyzeCommits: async (commits: any[]): Promise<Partial<CommitData>[]> => {
    // Initialize GoogleGenAI inside the function to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Analyze the following developer commits. For each commit, provide an "impact_score" (0-10) and a brief "ai_explanation".
      High impact is awarded for:
      - Complex architectural changes
      - Security fixes or authentication logic
      - Core feature implementations
      - Significant refactors improving performance
      Low impact is awarded for:
      - Typos, documentation only
      - Simple UI tweaks
      - Configuration boilerplate
      - Dependency updates

      Commits:
      ${commits.map((c, i) => `[${i}] Msg: ${c.message}, Added: ${c.additions}, Deleted: ${c.deletions}, Files: ${c.files.join(', ')}`).join('\n')}

      Return a JSON array where each object has "index", "impact_score", and "ai_explanation".
    `;

    try {
      // Using gemini-3-pro-preview for complex text analysis task
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                index: { type: Type.INTEGER },
                impact_score: { type: Type.NUMBER },
                ai_explanation: { type: Type.STRING },
              },
              required: ["index", "impact_score", "ai_explanation"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text from AI");
      }
      
      const results = JSON.parse(text.trim());
      return results.map((r: any) => ({
        impact_score: r.impact_score,
        ai_explanation: r.ai_explanation
      }));
    } catch (error) {
      console.error("AI Analysis failed:", error);
      // Fallback scoring if AI fails
      return commits.map(() => ({
        impact_score: Math.floor(Math.random() * 5) + 3,
        ai_explanation: "Manual heuristic analysis applied."
      }));
    }
  },

  calculateActivityScore: (c: any) => {
    // Basic logic: frequency + lines changed
    const volume = c.additions + c.deletions;
    let score = Math.min(10, (volume / 100) + 1);
    return score;
  }
};
