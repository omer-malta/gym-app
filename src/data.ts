import { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  // Chest
  { id: '1', name: { tr: 'Bench Press (Barbell)', en: 'Bench Press (Barbell)' }, muscle: { tr: 'Göğüs', en: 'Chest' } },
  { id: '2', name: { tr: 'Incline Bench Press (Dumbbell)', en: 'Incline Bench Press (Dumbbell)' }, muscle: { tr: 'Göğüs', en: 'Chest' } },
  { id: '3', name: { tr: 'Push Up', en: 'Push Up' }, muscle: { tr: 'Göğüs', en: 'Chest' } },
  { id: 'chest_4', name: { tr: 'Pec Deck Fly', en: 'Pec Deck Fly' }, muscle: { tr: 'Göğüs', en: 'Chest' } },
  { id: 'chest_5', name: { tr: 'Cable Crossover', en: 'Cable Crossover' }, muscle: { tr: 'Göğüs', en: 'Chest' } },
  { id: 'chest_6', name: { tr: 'Decline Bench Press', en: 'Decline Bench Press' }, muscle: { tr: 'Göğüs', en: 'Chest' } },
  { id: 'chest_7', name: { tr: 'Dumbbell Pullover', en: 'Dumbbell Pullover' }, muscle: { tr: 'Göğüs', en: 'Chest' } },
  
  // Back
  { id: '4', name: { tr: 'Deadlift (Barbell)', en: 'Deadlift (Barbell)' }, muscle: { tr: 'Sırt', en: 'Back' } },
  { id: '5', name: { tr: 'Pull Up', en: 'Pull Up' }, muscle: { tr: 'Sırt', en: 'Back' } },
  { id: '6', name: { tr: 'Lat Pulldown (Cable)', en: 'Lat Pulldown (Cable)' }, muscle: { tr: 'Sırt', en: 'Back' } },
  { id: 'back_4', name: { tr: 'Bent Over Row (Barbell)', en: 'Bent Over Row (Barbell)' }, muscle: { tr: 'Sırt', en: 'Back' } },
  { id: 'back_5', name: { tr: 'Seated Cable Row', en: 'Seated Cable Row' }, muscle: { tr: 'Sırt', en: 'Back' } },
  { id: 'back_6', name: { tr: 'T-Bar Row', en: 'T-Bar Row' }, muscle: { tr: 'Sırt', en: 'Back' } },
  { id: 'back_7', name: { tr: 'Single Arm Dumbbell Row', en: 'Single Arm Dumbbell Row' }, muscle: { tr: 'Sırt', en: 'Back' } },

  // Legs
  { id: '7', name: { tr: 'Squat (Barbell)', en: 'Squat (Barbell)' }, muscle: { tr: 'Bacak', en: 'Legs' } },
  { id: '8', name: { tr: 'Leg Press', en: 'Leg Press' }, muscle: { tr: 'Bacak', en: 'Legs' } },
  { id: '9', name: { tr: 'Romanian Deadlift (Barbell)', en: 'Romanian Deadlift (Barbell)' }, muscle: { tr: 'Bacak', en: 'Legs' } },
  { id: 'legs_4', name: { tr: 'Leg Extension', en: 'Leg Extension' }, muscle: { tr: 'Bacak', en: 'Legs' } },
  { id: 'legs_5', name: { tr: 'Leg Curl (Lying)', en: 'Leg Curl (Lying)' }, muscle: { tr: 'Bacak', en: 'Legs' } },
  { id: 'legs_6', name: { tr: 'Calf Raise (Standing)', en: 'Calf Raise (Standing)' }, muscle: { tr: 'Bacak', en: 'Legs' } },
  { id: 'legs_7', name: { tr: 'Bulgarian Split Squat', en: 'Bulgarian Split Squat' }, muscle: { tr: 'Bacak', en: 'Legs' } },
  { id: 'legs_8', name: { tr: 'Hip Thrust', en: 'Hip Thrust' }, muscle: { tr: 'Bacak', en: 'Legs' } },

  // Shoulders
  { id: '10', name: { tr: 'Overhead Press (Dumbbell)', en: 'Overhead Press (Dumbbell)' }, muscle: { tr: 'Omuz', en: 'Shoulders' } },
  { id: '11', name: { tr: 'Lateral Raise (Dumbbell)', en: 'Lateral Raise (Dumbbell)' }, muscle: { tr: 'Omuz', en: 'Shoulders' } },
  { id: '12', name: { tr: 'Face Pull (Cable)', en: 'Face Pull (Cable)' }, muscle: { tr: 'Omuz', en: 'Shoulders' } },
  { id: 'shoulder_4', name: { tr: 'Military Press (Barbell)', en: 'Military Press (Barbell)' }, muscle: { tr: 'Omuz', en: 'Shoulders' } },
  { id: 'shoulder_5', name: { tr: 'Front Raise (Dumbbell)', en: 'Front Raise (Dumbbell)' }, muscle: { tr: 'Omuz', en: 'Shoulders' } },
  { id: 'shoulder_6', name: { tr: 'Reverse Pec Deck', en: 'Reverse Pec Deck Fly' }, muscle: { tr: 'Omuz', en: 'Shoulders' } },
  { id: 'shoulder_7', name: { tr: 'Upright Row', en: 'Upright Row' }, muscle: { tr: 'Omuz', en: 'Shoulders' } },

  // Arms
  { id: '13', name: { tr: 'Bicep Curl (Dumbbell)', en: 'Bicep Curl (Dumbbell)' }, muscle: { tr: 'Kol', en: 'Arms' } },
  { id: '14', name: { tr: 'Tricep Extension (Cable)', en: 'Tricep Extension (Cable)' }, muscle: { tr: 'Kol', en: 'Arms' } },
  { id: '15', name: { tr: 'Hammer Curl (Dumbbell)', en: 'Hammer Curl (Dumbbell)' }, muscle: { tr: 'Kol', en: 'Arms' } },
  { id: 'arm_4', name: { tr: 'Barbell Curl', en: 'Barbell Curl' }, muscle: { tr: 'Kol', en: 'Arms' } },
  { id: 'arm_5', name: { tr: 'Preacher Curl', en: 'Preacher Curl' }, muscle: { tr: 'Kol', en: 'Arms' } },
  { id: 'arm_6', name: { tr: 'Skullcrushers', en: 'Skullcrushers' }, muscle: { tr: 'Kol', en: 'Arms' } },
  { id: 'arm_7', name: { tr: 'Tricep Dips', en: 'Tricep Dips' }, muscle: { tr: 'Kol', en: 'Arms' } },
  { id: 'arm_8', name: { tr: 'Concentration Curl', en: 'Concentration Curl' }, muscle: { tr: 'Kol', en: 'Arms' } },

  // Core
  { id: '16', name: { tr: 'Crunch', en: 'Crunch' }, muscle: { tr: 'Merkez', en: 'Core' } },
  { id: '17', name: { tr: 'Plank', en: 'Plank' }, muscle: { tr: 'Merkez', en: 'Core' } },
  { id: '18', name: { tr: 'Leg Raise', en: 'Leg Raise' }, muscle: { tr: 'Merkez', en: 'Core' } },
  { id: 'core_4', name: { tr: 'Russian Twist', en: 'Russian Twist' }, muscle: { tr: 'Merkez', en: 'Core' } },
  { id: 'core_5', name: { tr: 'Cable Crunch', en: 'Cable Crunch' }, muscle: { tr: 'Merkez', en: 'Core' } },
  { id: 'core_6', name: { tr: 'Ab Wheel Rollout', en: 'Ab Wheel Rollout' }, muscle: { tr: 'Merkez', en: 'Core' } },
  { id: 'core_7', name: { tr: 'Bicycle Crunch', en: 'Bicycle Crunch' }, muscle: { tr: 'Merkez', en: 'Core' } },

  // Cardio
  { id: '19', name: { tr: 'Koşu Bandı', en: 'Treadmill' }, muscle: { tr: 'Kardiyo', en: 'Cardio' } },
  { id: '20', name: { tr: 'Bisiklet', en: 'Bike' }, muscle: { tr: 'Kardiyo', en: 'Cardio' } },
  { id: 'cardio_3', name: { tr: 'Kürek', en: 'Rowing' }, muscle: { tr: 'Kardiyo', en: 'Cardio' } },
  { id: 'cardio_4', name: { tr: 'Eliptik', en: 'Elliptical' }, muscle: { tr: 'Kardiyo', en: 'Cardio' } },
  { id: 'cardio_5', name: { tr: 'İp Atlama', en: 'Jump Rope' }, muscle: { tr: 'Kardiyo', en: 'Cardio' } }
];
