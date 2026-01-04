
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, PredictionResult, LogType, MoodLevel } from "../types.ts";

const getApiKey = (): string | undefined => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    return undefined;
  }
};

const formatLogsForPrompt = (logs: LogEntry[]): string => {
  return logs
    .slice(-20)
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
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("API Key not found. Falling back to simulated analysis for demo purposes.");
    return {
      riskScore: 24,
      riskLevel: "Low",
      explanation: "AI Simulation: Current behavior patterns appear stable. Please connect a Gemini API key in your project settings to enable real-time predictive analysis.",
      recommendations: [
        "Maintain established sensory routines",
        "Offer a preferred quiet activity choice",
        "Monitor for any changes in environment noise"
      ]
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const logsText = formatLogsForPrompt(logs);

  const prompt = `
    You are an expert behavioral analyst system for children with autism. 
    Analyze the following chronological activity logs recorded by caregivers:
    ${logsText}
    
    Predict the current risk of a meltdown.
    Provide a risk score (0-100), a short explanation, and 3 specific actionable recommendations.
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
            riskScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Critical"] },
            explanation: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskScore", "riskLevel", "explanation", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as PredictionResult;
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return {
      riskScore: 0,
      riskLevel: "Low",
      explanation: "Predictive engine temporarily unavailable. Please verify connectivity.",
      recommendations: ["Ensure stable internet access", "Refresh the dashboard", "Check API usage limits"]
    };
  }
};
