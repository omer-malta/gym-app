import { useState, useEffect, useRef } from 'react';
import { Timer, Check, X, Plus, MoreHorizontal, Settings2, Clock } from 'lucide-react';
import { Workout, WorkoutExercise, Exercise, WorkoutSet, Routine, SetType } from '../types';
import { generateId, formatTime, cn } from '../utils';
import { useAppContext } from '../context/AppContext';
import { ExercisePicker } from './ExercisePicker';
import { translations } from '../i18n';

export function ActiveWorkout({ 
  routine,
  onFinish, 
  onCancel 
}: { 
  routine?: Routine,
  onFinish: (w: Workout) => void, 
  onCancel: () => void 
}) {
  const { addWorkout, workouts, lang } = useAppContext();
  const t = translations[lang];
  
  const [activeWorkout, setActiveWorkout] = useState<Workout>(() => {
    const startTime = Date.now();
    if (routine) {
      return {
        id: generateId(),
        name: routine.name,
        startTime,
        exercises: routine.exercises.map(re => {
          let lastWeight = '';
          for (const w of workouts) {
            const pastEx = w.exercises.find(e => e.exercise.id === re.exercise.id);
            if (pastEx && pastEx.sets.length > 0) {
              const completedSets = pastEx.sets.filter(s => s.completed);
              if (completedSets.length > 0) {
                lastWeight = completedSets[completedSets.length - 1].weight;
              } else {
                lastWeight = pastEx.sets[0].weight;
              }
              break;
            }
          }
          return {
            id: generateId(),
            exercise: re.exercise,
            restTime: re.restTime,
            sets: Array.from({ length: re.targetSets }).map(() => ({
              id: generateId(),
              weight: lastWeight,
              reps: re.targetReps,
              time: re.targetTime || '',
              completed: false
            }))
          };
        })
      };
    }
    return {
      id: generateId(),
      name: t.workoutName,
      startTime,
      exercises: []
    };
  });

  const [elapsed, setElapsed] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  
  // Rest Timer State
  const [restTimeLeft, setRestTimeLeft] = useState<number | null>(null);
  const [showSettingsFor, setShowSettingsFor] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeWorkout.startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeWorkout.startTime]);

  useEffect(() => {
    if (restTimeLeft !== null && restTimeLeft > 0) {
      const timer = setTimeout(() => setRestTimeLeft(restTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (restTimeLeft === 0) {
      setRestTimeLeft(null);
    }
  }, [restTimeLeft]);

  const handleAddExercise = (exercise: Exercise) => {
    let lastWeight = '';
    let lastReps = '';
    for (const w of workouts) {
      const pastEx = w.exercises.find(e => e.exercise.id === exercise.id);
      if (pastEx && pastEx.sets.length > 0) {
        const completedSets = pastEx.sets.filter(s => s.completed);
        if (completedSets.length > 0) {
          lastWeight = completedSets[completedSets.length - 1].weight;
          lastReps = completedSets[completedSets.length - 1].reps;
        } else {
          lastWeight = pastEx.sets[0].weight;
          lastReps = pastEx.sets[0].reps;
        }
        break;
      }
    }

    const newEx: WorkoutExercise = {
      id: generateId(),
      exercise,
      restTime: 90,
      sets: [
        { id: generateId(), weight: lastWeight, reps: lastReps, completed: false }
      ]
    };
    setActiveWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newEx]
    }));
    setShowPicker(false);
  };

  const addSet = (exerciseIndex: number) => {
    const newWorkout = { ...activeWorkout };
    newWorkout.exercises = [...newWorkout.exercises];
    const ex = { ...newWorkout.exercises[exerciseIndex] };
    ex.sets = [...ex.sets];
    const lastSet = ex.sets[ex.sets.length - 1];
    ex.sets.push({
      id: generateId(),
      weight: lastSet ? lastSet.weight : '',
      reps: lastSet ? lastSet.reps : '',
      time: lastSet ? lastSet.time : '',
      completed: false
    });
    newWorkout.exercises[exerciseIndex] = ex;
    setActiveWorkout(newWorkout);
  };

  const updateRestTime = (exerciseIndex: number, newRestTime: number) => {
    const newWorkout = { ...activeWorkout };
    newWorkout.exercises = [...newWorkout.exercises];
    newWorkout.exercises[exerciseIndex] = { ...newWorkout.exercises[exerciseIndex], restTime: newRestTime };
    setActiveWorkout(newWorkout);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
    const newWorkout = { ...activeWorkout };
    newWorkout.exercises = [...newWorkout.exercises];
    const ex = { ...newWorkout.exercises[exerciseIndex] };
    ex.sets = [...ex.sets];
    const set = { ...ex.sets[setIndex] };
    
    // Toggle completion
    if (field === 'completed') {
      const isCompleting = value as boolean;
      if (isCompleting && !set.completed) {
        // Start rest timer
        if (ex.restTime > 0) {
          setRestTimeLeft(ex.restTime);
        }
      }
    }

    ex.sets[setIndex] = {
      ...set,
      [field]: value
    };
    newWorkout.exercises[exerciseIndex] = ex;
    setActiveWorkout(newWorkout);
  };

  const removeExercise = (index: number) => {
    const newWorkout = { ...activeWorkout };
    newWorkout.exercises = [...newWorkout.exercises];
    newWorkout.exercises.splice(index, 1);
    setActiveWorkout(newWorkout);
  };

  const handleFinish = () => {
    const completedWorkout = {
      ...activeWorkout,
      endTime: Date.now()
    };
    addWorkout(completedWorkout);
    onFinish(completedWorkout);
  };

  const handleCancel = () => {
    if (confirm(t.confirmCancel)) {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      
      {/* Rest Timer Overlay - Custom Logic */}
      {restTimeLeft !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={cn(
            "w-full max-w-sm rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300",
            restTimeLeft <= 3 ? "bg-red-600/90 shadow-[0_0_100px_rgba(220,38,38,0.8)] scale-105" : "bg-slate-900 border border-slate-800 shadow-2xl"
          )}>
            <p className={cn(
              "font-bold uppercase tracking-widest mb-4 transition-colors",
              restTimeLeft <= 3 ? "text-white" : "text-blue-500"
            )}>
              {t.rest}
            </p>
            
            <div className={cn(
              "font-mono font-black leading-none transition-all duration-500 ease-out",
              restTimeLeft <= 3 
                ? "text-9xl text-white animate-pulse" 
                : restTimeLeft <= 10 
                  ? "text-8xl text-white" 
                  : "text-7xl text-white"
            )}>
              {formatTime(restTimeLeft)}
            </div>

            <button 
              onClick={() => setRestTimeLeft(null)}
              className={cn(
                "mt-12 font-bold py-4 px-10 rounded-full transition-all text-sm uppercase tracking-wider",
                restTimeLeft <= 3 ? "bg-white/20 text-white hover:bg-white/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              {t.skip}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950 p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
            <Timer size={16} className="text-blue-500" />
          </div>
          <span className="font-extrabold text-white tracking-tight">{t.appTitle}</span>
        </div>
        <button 
          onClick={handleFinish}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2 px-6 rounded-full text-sm transition-colors"
        >
          {t.finish}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 hide-scrollbar">
        
        {/* Name Input */}
        <input 
          type="text"
          value={activeWorkout.name}
          onChange={(e) => setActiveWorkout({...activeWorkout, name: e.target.value})}
          className="bg-transparent border-none text-[28px] font-extrabold text-white w-full focus:outline-none focus:ring-0 placeholder-slate-700 mb-8"
          placeholder={t.workoutName}
        />

        {/* Exercises List */}
        <div className="space-y-4 mb-6">
          {activeWorkout.exercises.map((ex, exIndex) => {
            const isSupersetWithPrev = exIndex > 0 && ex.supersetId && ex.supersetId === activeWorkout.exercises[exIndex - 1].supersetId;
            const isSupersetWithNext = exIndex < activeWorkout.exercises.length - 1 && ex.supersetId && ex.supersetId === activeWorkout.exercises[exIndex + 1].supersetId;
            
            return (
            <div key={ex.id} className="relative">
              {isSupersetWithPrev && (
                <div className="absolute -top-4 left-8 bottom-0 w-1 bg-blue-600 z-10" />
              )}
              {isSupersetWithNext && !isSupersetWithPrev && (
                <div className="absolute top-0 left-8 -bottom-4 w-1 bg-blue-600 z-10 rounded-t-full" />
              )}
              {isSupersetWithPrev && !isSupersetWithNext && (
                <div className="absolute -top-4 left-8 h-12 w-1 bg-blue-600 z-10 rounded-b-full" />
              )}
              
              <div className={cn(
                "bg-slate-900 border border-slate-800 overflow-hidden relative z-0",
                isSupersetWithPrev ? "rounded-b-3xl rounded-t-xl mt-1" : "rounded-3xl"
              )}>
                {ex.supersetId && (
                  <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
                <div className={cn("flex items-start justify-between p-4 pb-2", ex.supersetId && "pl-8")}>
                  <div>
                  <h3 className="text-white font-bold text-lg">{ex.exercise.name[lang]}</h3>
                  <p className="text-xs text-blue-400 font-medium mt-1 mb-2">{ex.exercise.muscle[lang]}</p>
                  <button 
                    onClick={() => setShowSettingsFor(showSettingsFor === exIndex ? null : exIndex)}
                    className="text-blue-400 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Clock size={12} />
                    {ex.restTime > 0 ? `${t.restTime}: ${ex.restTime}s` : `${t.restTime}: OFF`}
                  </button>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setShowSettingsFor(showSettingsFor === exIndex ? null : exIndex)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      showSettingsFor === exIndex ? "bg-slate-800 text-white" : "text-slate-500 hover:text-white"
                    )}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {showSettingsFor === exIndex && (
                <div className="px-4 pb-3 space-y-2">
                  <div className="bg-slate-950/50 rounded-2xl p-3 border border-slate-800/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.restTime}</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          min="0"
                          value={ex.restTime || ''}
                          onChange={(e) => updateRestTime(exIndex, parseInt(e.target.value) || 0)}
                          className="w-20 bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2 text-white font-bold focus:outline-none text-center focus:border-blue-500 transition-colors"
                        />
                        <span className="text-sm font-bold text-slate-500">sn</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const newWorkout = { ...activeWorkout };
                          newWorkout.exercises = [...newWorkout.exercises];
                          newWorkout.exercises[exIndex] = { 
                            ...newWorkout.exercises[exIndex], 
                            notes: newWorkout.exercises[exIndex].notes !== undefined ? undefined : '' 
                          };
                          setActiveWorkout(newWorkout);
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                      >
                        {ex.notes !== undefined ? 'Notu Kapat' : t.addNotes}
                      </button>
                      
                      {exIndex > 0 && (
                        <button 
                          onClick={() => {
                            const newWorkout = { ...activeWorkout };
                            newWorkout.exercises = [...newWorkout.exercises];
                            const prevEx = newWorkout.exercises[exIndex - 1];
                            const currentEx = newWorkout.exercises[exIndex];
                            
                            if (currentEx.supersetId && currentEx.supersetId === prevEx.supersetId) {
                              currentEx.supersetId = undefined; // unlink
                            } else {
                              const sid = prevEx.supersetId || generateId();
                              prevEx.supersetId = sid;
                              currentEx.supersetId = sid;
                            }
                            setActiveWorkout(newWorkout);
                          }}
                          className={cn(
                            "flex-1 border rounded-xl py-2 px-3 text-xs font-bold transition-colors",
                            ex.supersetId && ex.supersetId === activeWorkout.exercises[exIndex - 1]?.supersetId
                              ? "bg-blue-600 border-blue-500 text-white"
                              : "bg-slate-900 border-slate-800 text-white hover:bg-slate-800"
                          )}
                        >
                          {t.superset}
                        </button>
                      )}
                      
                      <button 
                        onClick={() => removeExercise(exIndex)}
                        className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl py-2 px-3 text-xs font-bold transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {ex.notes !== undefined && (
                <div className="px-4 pb-3">
                  <textarea
                    value={ex.notes}
                    onChange={(e) => {
                      const newWorkout = { ...activeWorkout };
                      newWorkout.exercises = [...newWorkout.exercises];
                      newWorkout.exercises[exIndex] = { ...newWorkout.exercises[exIndex], notes: e.target.value };
                      setActiveWorkout(newWorkout);
                    }}
                    placeholder={t.notes + '...'}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-600 resize-none"
                    rows={2}
                  />
                </div>
              )}

              <div className="px-4 pb-4 overflow-x-auto hide-scrollbar -mx-4">
                <div className="min-w-[400px] px-4">
                  {/* Header row */}
                  <div className="grid grid-cols-[30px_minmax(40px,1fr)_1fr_1fr_1fr_40px_44px] gap-2 text-center mb-2 px-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center">#</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.previous || 'PREV'}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.weight}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.reps}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.duration}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RPE</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center"><Check size={14} /></span>
                  </div>

                  {/* Sets */}
                  <div className="space-y-1.5">
                  {ex.sets.map((set, setIndex) => {
                    let prevString = '-';
                    for (const w of workouts) {
                      const pastEx = w.exercises.find(e => e.exercise.id === ex.exercise.id);
                      if (pastEx && pastEx.sets[setIndex] && pastEx.sets[setIndex].completed) {
                        const ps = pastEx.sets[setIndex];
                        const parts = [];
                        if (ps.weight) parts.push(ps.weight);
                        if (ps.reps) parts.push(ps.reps);
                        if (ps.time) parts.push(`${ps.time}s`);
                        prevString = parts.length > 0 ? parts.join(' x ') : '-';
                        break;
                      }
                    }

                    const cycleSetType = () => {
                      const types: (SetType | undefined)[] = ['normal', 'warmup', 'dropset', 'failure'];
                      const currentIdx = types.indexOf(set.type || 'normal');
                      const nextType = types[(currentIdx + 1) % types.length];
                      updateSet(exIndex, setIndex, 'type', nextType);
                    };

                    let typeLabel = setIndex + 1;
                    let typeColor = "bg-slate-800 text-slate-400";
                    if (set.type === 'warmup') {
                      typeLabel = 'W' as any;
                      typeColor = "bg-orange-500/20 text-orange-400";
                    } else if (set.type === 'dropset') {
                      typeLabel = 'D' as any;
                      typeColor = "bg-red-500/20 text-red-400";
                    } else if (set.type === 'failure') {
                      typeLabel = 'F' as any;
                      typeColor = "bg-purple-500/20 text-purple-400";
                    } else if (set.completed) {
                      typeColor = "bg-blue-500/20 text-blue-400";
                    }

                    return (
                    <div key={set.id} className={cn(
                      "grid grid-cols-[30px_minmax(40px,1fr)_1fr_1fr_1fr_40px_44px] gap-1.5 items-center rounded-xl p-1 transition-colors",
                      set.completed ? "bg-blue-500/10" : ""
                    )}>
                      <div className="text-center">
                        <button 
                          onClick={cycleSetType}
                          className={cn(
                          "text-xs font-bold w-6 h-6 rounded-full inline-flex items-center justify-center transition-colors",
                          typeColor
                        )}>
                          {typeLabel}
                        </button>
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis px-1 flex items-center justify-center">
                        {prevString}
                      </div>
                      <div>
                        <input 
                          type="number" 
                          inputMode="decimal"
                          value={set.weight}
                          onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                          placeholder={t.placeholderWeight}
                          className={cn(
                            "w-full bg-slate-950/50 border text-white rounded-lg py-2.5 px-1 text-center text-sm font-bold focus:outline-none transition-colors",
                            set.completed ? "border-transparent bg-transparent opacity-80" : "border-slate-800 focus:border-blue-500 focus:bg-slate-900 placeholder-slate-700"
                          )}
                        />
                      </div>
                      <div>
                        <input 
                          type="number" 
                          inputMode="numeric"
                          value={set.reps}
                          onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                          placeholder={t.placeholderReps}
                          className={cn(
                            "w-full bg-slate-950/50 border text-white rounded-lg py-2.5 px-1 text-center text-sm font-bold focus:outline-none transition-colors",
                            set.completed ? "border-transparent bg-transparent opacity-80" : "border-slate-800 focus:border-blue-500 focus:bg-slate-900 placeholder-slate-700"
                          )}
                        />
                      </div>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          min="0"
                          inputMode="numeric"
                          value={set.time || ''}
                          onChange={(e) => updateSet(exIndex, setIndex, 'time', e.target.value)}
                          placeholder="-"
                          className={cn(
                            "w-full bg-slate-950/50 border text-white rounded-lg py-2.5 px-1 pr-5 text-center text-sm font-bold focus:outline-none transition-colors",
                            set.completed ? "border-transparent bg-transparent opacity-80" : "border-slate-800 focus:border-blue-500 focus:bg-slate-900 placeholder-slate-700"
                          )}
                        />
                        <span className="absolute right-1.5 text-[9px] font-bold text-slate-500 pointer-events-none">sn</span>
                      </div>
                      <div>
                        <input 
                          type="number" 
                          min="1"
                          max="10"
                          inputMode="numeric"
                          value={set.rpe || ''}
                          onChange={(e) => updateSet(exIndex, setIndex, 'rpe', parseFloat(e.target.value))}
                          placeholder="-"
                          className={cn(
                            "w-full bg-slate-950/50 border text-white rounded-lg py-2.5 px-1 text-center text-sm font-bold focus:outline-none transition-colors",
                            set.completed ? "border-transparent bg-transparent opacity-80" : "border-slate-800 focus:border-blue-500 focus:bg-slate-900 placeholder-slate-700"
                          )}
                        />
                      </div>
                      <div className="flex justify-center">
                        <button 
                          onClick={() => updateSet(exIndex, setIndex, 'completed', !set.completed)}
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                            set.completed ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" : "bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-95"
                          )}
                        >
                          <Check size={18} strokeWidth={set.completed ? 3 : 2} />
                        </button>
                      </div>
                    </div>
                  )})}
                </div>
                </div>

                <button 
                  onClick={() => addSet(exIndex)}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 text-slate-400 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  <Plus size={16} /> {t.addSet}
                </button>
              </div>
            </div>
            </div>
          )})}
        </div>

        <button 
          onClick={() => setShowPicker(true)}
          className="w-full py-4 rounded-2xl bg-slate-900 text-blue-500 font-extrabold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <Plus size={20} /> {t.addExercise}
        </button>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-slate-950 max-w-md mx-auto border-x border-slate-900/50">
        <button 
          onClick={handleCancel}
          className="w-full py-4 rounded-2xl border border-red-900 bg-red-950/30 text-red-500 font-extrabold hover:bg-red-900/40 transition-colors"
        >
          {t.cancel}
        </button>
      </div>

      {showPicker && (
        <ExercisePicker 
          onPick={handleAddExercise}
          onClose={() => setShowPicker(false)}
        />
      )}

    </div>
  );
}
