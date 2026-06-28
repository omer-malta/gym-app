export type Language = 'tr' | 'en';

export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure';

export interface Exercise {
  id: string;
  name: {
    tr: string;
    en: string;
  };
  muscle: {
    tr: string;
    en: string;
  };
}

export interface WorkoutSet {
  id: string;
  weight: string;
  reps: string;
  time?: string;
  completed: boolean;
  type?: SetType;
  rpe?: number;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  restTime: number; 
  notes?: string;
  supersetId?: string;
}

export interface Workout {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface RoutineExercise {
  id: string;
  exercise: Exercise;
  targetSets: number;
  targetReps: string;
  targetTime?: string;
  restTime: number; 
  notes?: string;
  supersetId?: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
}

export interface Measurement {
  id: string;
  date: number;
  weight?: number; // kg
  chest?: number; // cm
  shoulders?: number; // cm
  arms?: number; // cm
  legs?: number; // cm
  waist?: number; // cm
  bodyFat?: number; // percentage
}
