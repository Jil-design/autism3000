
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, PredictionResult, LogType, MoodLevel } from "../types";

// Safe access to process.env for browser environments
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
    console.warn("API Key not found or process.env is unavailable. Using mock data.");
    return {
      riskScore: 24,
      riskLevel: "Low",
      explanation: "AI Simulation: Patterns look stable based on recent logs. To enable real AI, add an API_KEY to your deployment environment variables.",
      recommendations: [
        "Maintain current sensory environment",
        "Plan a transition break in the next hour",
        "Monitor for subtle signs of restlessness"
      ]
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const logsText = formatLogsForPrompt(logs);

  const prompt = `
    You are an expert behavioral analyst system for children with autism. 
    Analyze the following chronological activity logs:
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
      explanation: "Unable to generate prediction. Check your API key and connection.",
      recommendations: ["Check project configuration", "Verify network status"]
    };
  }
};
