
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, PredictionResult, LogType, MoodLevel } from "../types";

// Helper to format logs for the AI
const formatLogsForPrompt = (logs: LogEntry[]): string => {
  return logs
    .slice(-20) // Analyze last 20 entries for context
    .map(log => {
      const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let details = "";
      
      switch (log.type) {
        case LogType.MOOD:
          details = `Mood: ${MoodLevel[log.moodLevel || 3]} (${log.details || ''})`;
          break;
        case LogType.STRESS_INDICATOR:
          details = `Indicator: ${log.stressLevel}`;
          break;
        case LogType.ACTIVITY:
          details = `Activity: ${log.activityName} - ${log.details || ''}`;
          break;
        case LogType.NOTE:
          details = `Note: ${log.details}`;
          break;
      }
      return `[${time}] [${log.authorRole}] ${details}`;
    })
    .join("\n");
};

export const getPrediction = async (logs: LogEntry[]): Promise<PredictionResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found, returning mock data");
    // Fallback for demo if no key provided
    return {
      riskScore: 24,
      riskLevel: "Low",
      explanation: "AI Simulation: Patterns look stable based on recent logs. Connect a Gemini API key in settings for real-time behavioral analysis.",
      recommendations: [
        "Maintain current sensory environment",
        "Plan a transition break in the next hour",
        "Monitor for subtle signs of restlessness"
      ]
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const logsText = formatLogsForPrompt(logs);

  const prompt = `
    You are an expert behavioral analyst system for children with autism. 
    Analyze the following chronological activity logs recorded by parents and educators.
    
    Logs:
    ${logsText}
    
    Based on patterns, sensory load, transitions, and mood, predict the current risk of a meltdown.
    Provide a risk score (0-100), a short explanation, and 3 specific actionable recommendations for the caregiver currently viewing the app.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER, description: "0 to 100 probability of meltdown" },
            riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Critical"] },
            explanation: { type: Type.STRING, description: "Brief analysis of why the risk is at this level." },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 specific, short actionable tips."
            }
          },
          required: ["riskScore", "riskLevel", "explanation", "recommendations"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as PredictionResult;
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return {
      riskScore: 0,
      riskLevel: "Low",
      explanation: "Unable to generate prediction at this time.",
      recommendations: ["Check internet connection", "Try again later"]
    };
  }
};
