
import { LogEntry, LogType, MoodLevel, StressLevel, UserRole } from "../types.ts";

const SHEET_ID = '1vy9GLU3dww9Cl8UtYeAODbndFRIn_WyN3gVtem0DK1s';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export const fetchLogsFromSheet = async (childId: string): Promise<LogEntry[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch sheet data');
    
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.split(','));
    const logs: LogEntry[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 3) continue;

      const [dateStr, timeStr, typeStr, moodVal, stressStr, activityName, details, roleStr] = row.map(s => s?.trim() || '');
      const timestamp = new Date(`${dateStr} ${timeStr}`).getTime() || Date.now();

      logs.push({
        id: `sheet-${i}-${timestamp}`,
        childId,
        timestamp,
        type: (typeStr as LogType) || LogType.NOTE,
        moodLevel: parseInt(moodVal) as MoodLevel || undefined,
        stressLevel: (stressStr as StressLevel) || undefined,
        activityName: activityName || undefined,
        details: details || "",
        authorRole: (roleStr as UserRole) || UserRole.PARENT
      });
    }

    return logs;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    throw error;
  }
};
