
import { GoogleGenAI } from "@google/genai";
import { Contraction, User } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getAdvice(contractions: Contraction[], user: User | null): Promise<string> {
    if (contractions.length === 0) return "Start tracking to receive personalized advice.";
    
    const recent = contractions.slice(-5);
    const avgDuration = recent.reduce((acc, c) => acc + c.duration, 0) / recent.length;
    const avgGap = recent.length > 1 
      ? recent.slice(1).reduce((acc, c, i) => acc + (c.gap || 0), 0) / (recent.length - 1)
      : null;

    const weeksAlong = user?.weeksAlong || "unknown";

    const prompt = `
      User is tracking contractions. 
      User status: ${weeksAlong} weeks pregnant.
      Recent data:
      ${JSON.stringify(recent.map(c => ({ duration: c.duration, gap: c.gap, intensity: c.intensity })))}
      
      Average duration: ${Math.round(avgDuration)}s
      Average gap: ${avgGap ? Math.round(avgGap / 60) : 'N/A'}m
      
      Provide a short, 2-line reassuring advice for the user based on these patterns and their stage of pregnancy. 
      If patterns are regular (around 5 mins apart, 60s long), suggest preparing for hospital. 
      If it is early (pre-term), suggest calling their provider immediately.
      Otherwise, suggest hydration, rest, or movement.
      Be empathetic.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "Patterns look consistent. Stay hydrated and rest.";
    } catch (error) {
      console.error("Gemini advice error:", error);
      return "Patterns look consistent. Stay hydrated and rest.";
    }
  }
}

export const geminiService = new GeminiService();
