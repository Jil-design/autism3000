import { MoodLevel, StressLevel } from "./types";
import { Smile, Frown, Meh, AlertCircle, Zap, Moon, Sun, BookOpen, Utensils, Activity, Users } from "lucide-react";

export const APP_COLOR_PRIMARY = "text-slate-800";
export const APP_COLOR_ACCENT = "text-rose-500"; // The '3000' and Heart color
export const BG_COLOR_ACCENT = "bg-rose-500";
export const BORDER_COLOR_ACCENT = "border-rose-500";

export const MOOD_OPTIONS = [
  { value: MoodLevel.VERY_HAPPY, label: "Very Happy", icon: Smile, color: "text-green-500" },
  { value: MoodLevel.HAPPY, label: "Happy", icon: Smile, color: "text-emerald-400" },
  { value: MoodLevel.NEUTRAL, label: "Neutral", icon: Meh, color: "text-yellow-500" },
  { value: MoodLevel.UNSETTLED, label: "Unsettled", icon: Frown, color: "text-orange-500" },
  { value: MoodLevel.DISTRESSED, label: "Distressed", icon: AlertCircle, color: "text-red-600" },
];

export const STRESS_BUTTONS = [
  { 
    value: StressLevel.CALM, 
    label: "Calm", 
    color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/60 dark:text-green-300 dark:border-green-700/50" 
  },
  { 
    value: StressLevel.RESTLESS, 
    label: "Restless / Stimulated", 
    color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-700/50" 
  },
  { 
    value: StressLevel.STRESSED, 
    label: "Signs of Stress", 
    color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/60 dark:text-orange-300 dark:border-orange-700/50" 
  },
  { 
    value: StressLevel.NEEDS_BREAK, 
    label: "Needs Break", 
    color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-700/50" 
  },
  { 
    value: StressLevel.OVERWHELMED, 
    label: "Overwhelmed", 
    color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/60 dark:text-red-300 dark:border-red-700/50" 
  },
];

export const ACTIVITY_CATEGORIES = [
  { label: "Transition", icon: Activity },
  { label: "Meal / Snack", icon: Utensils },
  { label: "Therapy", icon: Users },
  { label: "Sensory Break", icon: Zap },
  { label: "Sleep / Rest", icon: Moon },
  { label: "Learning / Class", icon: BookOpen },
  { label: "Social", icon: Users },
  { label: "Play", icon: Sun },
];

export const COMMUNITY_POSTS = [
  {
    id: 1,
    author: "Sarah M.",
    role: "Educator",
    content: "The AI recommended a change in routine yesterday, and it made all the difference! [Child] had an exceptional afternoon session.",
    likes: 24,
    time: "2h ago"
  },
  {
    id: 2,
    author: "David K.",
    role: "Parent",
    content: "Seeing the specific achievements from school helps me talk to my child about their day. Thank you, [Educator Name]!",
    likes: 15,
    time: "4h ago"
  },
  {
    id: 3,
    author: "Autism3000 Team",
    role: "Admin",
    content: "Tip: Remember to input the initial mood—it really refines the AI's predictions for the day.",
    likes: 142,
    time: "Pinned"
  }
];

export const SIMULATED_GRAPH_DATA = [
  { time: '08:30', moodScore: 40, heartRate: 72 },
  { time: '09:00', moodScore: 65, heartRate: 75 },
  { time: '09:30', moodScore: 85, heartRate: 78 },
  { time: '10:00', moodScore: 90, heartRate: 80 },
  { time: '10:30', moodScore: 70, heartRate: 85 },
  { time: '11:00', moodScore: 55, heartRate: 92 }, // Maybe a stress spike
  { time: '11:30', moodScore: 45, heartRate: 88 },
  { time: '12:00', moodScore: 60, heartRate: 76 },
  { time: '12:30', moodScore: 80, heartRate: 74 },
  { time: '13:00', moodScore: 85, heartRate: 75 },
];