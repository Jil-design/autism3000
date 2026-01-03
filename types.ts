export enum UserRole {
  PARENT = 'Parent',
  EDUCATOR = 'Educator',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  info: string;
  inviteCode: string; // Simple unique code for linking
  parentName: string;
  emergencyContact: string;
}

export type AppView = 'dashboard' | 'community';

export enum LogType {
  MOOD = 'Mood',
  ACTIVITY = 'Activity',
  STRESS_INDICATOR = 'Stress Indicator',
  ACHIEVEMENT = 'Achievement',
  NOTE = 'Note'
}

export enum MoodLevel {
  VERY_HAPPY = 5,
  HAPPY = 4,
  NEUTRAL = 3,
  UNSETTLED = 2,
  DISTRESSED = 1
}

export enum StressLevel {
  CALM = 'Calm',
  RESTLESS = 'Stimulated / Restless',
  STRESSED = 'Signs of Stress',
  OVERWHELMED = 'Overwhelmed',
  NEEDS_BREAK = 'Needs Break'
}

export interface LogEntry {
  id: string;
  childId: string; // Links log to specific child
  timestamp: number; // Date.now()
  type: LogType;
  authorRole: UserRole;
  authorName?: string; // Added to track who logged it
  
  // Specific fields based on type (optional)
  moodLevel?: MoodLevel;
  activityName?: string;
  stressLevel?: StressLevel;
  details?: string;
  
  // Sleep specific
  sleepQuality?: number; // 1-5
}

export interface PredictionResult {
  riskScore: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  explanation: string;
  recommendations: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'critical';
}