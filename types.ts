
export interface Contraction {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number; // seconds
  gap?: number; // seconds since last contraction ended
  intensity?: number; // 1-5
  notes?: string;
}

export interface User {
  name: string;
  weeksAlong: number;
  dueDate?: string;
  isPremium: boolean;
}

export type ScreenState = 
  | 'onboarding' 
  | 'setup' 
  | 'home' 
  | 'tracking' 
  | 'summary' 
  | 'history' 
  | 'profile' 
  | 'paywall' 
  | 'feedback';
