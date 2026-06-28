import { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Routine, RoutineExercise, Exercise } from '../types';
import { generateId, cn } from '../utils';
import { useAppContext } from '../context/AppContext';
import { ExercisePicker } from './ExercisePicker';
import { translations } from '../i18n';

export function RoutineBuilder({ onClose, routineToEdit }: { onClose: () => void, routineToEdit?: Routine }) {
  const { lang, addRoutine, updateRoutine } = useAppContext();
  const t = translations[lang];
  
  const [name, setName] = useState(routineToEdit?.name || '');
  const [exercises, setExercises] = useState<RoutineExercise[]>(routineToEdit?.exercises || []);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  const handleAddExercise = (exercise: Exercise) => {
    setError('');
    setExercises(prev => [...prev, {
      id: generateId(),
      exercise,
      targetSets: 3,
      targetReps: '10',
      restTime: 90 // default 90s
    }]);
    setShowPicker(false);
  };

  const updateExercise = (index: number, field: keyof RoutineExercise, value: any) => {
    const next = [...exercises];
    next[index] = { ...next[index], [field]: value };
    setExercises(next);
  };

  const removeExercise = (index: number) => {
    const next = [...exercises];
    next.splice(index, 1);
    setExercises(next);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError(lang === 'tr' ? 'Lütfen bir rutin adı girin.' : 'Please enter a routine name.');
      return;
    }
    if (exercises.length === 0) {
      setError(lang === 'tr' ? 'Lütfen en az bir egzersiz ekleyin.' : 'Please add at least one exercise.');
      return;
    }
    
    if (routineToEdit) {
      updateRoutine({
        ...routineToEdit,
        name: name.trim(),
        exercises
      });
      onClose();
      return;
    }

    const success = addRoutine({
      id: generateId(),
      name: name.trim(),
      exercises
    });
    
    if (!success) {
      setError(lang === 'tr' ? 'Ücretsiz versiyonda en fazla 2 rutin oluşturabilirsiniz.' : 'You can only create up to 2 routines in the free version.');
      return;
    }
    
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 animate-in slide-in-from-bottom-4 duration-300 relative">
      
      <div className="sticky top-0 z-10 bg-slate-950 p-5 flex items-center justify-between border-b border-slate-900/50">
        <h2 className="text-xl font-extrabold text-white">{t.createRoutine}</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 hide-scrollbar">
        
        <input 
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          placeholder={t.routineName}
          className="bg-transparent border-none text-[28px] font-extrabold text-white w-full focus:outline-none focus:ring-0 placeholder-slate-700 mt-6 mb-8"
        />

        <div className="space-y-4 mb-6">
          {exercises.map((ex, i) => {
            const isSupersetWithPrev = i > 0 && ex.supersetId && ex.supersetId === exercises[i - 1].supersetId;
            const isSupersetWithNext = i < exercises.length - 1 && ex.supersetId && ex.supersetId === exercises[i + 1].supersetId;
            
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
                "bg-slate-900 border border-slate-800 p-5 relative z-0",
                isSupersetWithPrev ? "rounded-b-3xl rounded-t-xl mt-1" : "rounded-3xl"
              )}>
                {ex.supersetId && (
                  <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
                
                <div className="flex gap-1 absolute top-4 right-4">
                  {i > 0 && (
                    <button 
                      onClick={() => {
                        const newExercises = [...exercises];
                        const prevEx = newExercises[i - 1];
                        const currentEx = newExercises[i];
                        
                        if (currentEx.supersetId && currentEx.supersetId === prevEx.supersetId) {
                          currentEx.supersetId = undefined;
                        } else {
                          const sid = prevEx.supersetId || generateId();
                          prevEx.supersetId = sid;
                          currentEx.supersetId = sid;
                        }
                        setExercises(newExercises);
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider",
                        ex.supersetId && ex.supersetId === exercises[i - 1]?.supersetId
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-slate-500 hover:text-white bg-slate-800/50"
                      )}
                      title={t.superset}
                    >
                      Sup
                    </button>
                  )}
                  <button 
                    onClick={() => removeExercise(i)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              
                <div className={cn(ex.supersetId && "pl-4")}>
                  <h3 className="text-white font-bold text-lg mb-1 pr-20">{ex.exercise.name[lang]}</h3>
                  <p className="text-xs text-blue-500 uppercase tracking-widest font-bold mb-5">{ex.exercise.muscle[lang]}</p>
                </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-950/50 rounded-2xl p-2 border border-slate-800/50 flex flex-col items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 text-center">{t.sets}</label>
                  <input 
                    type="number"
                    min="0"
                    value={ex.targetSets}
                    onChange={e => updateExercise(i, 'targetSets', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-white font-bold focus:outline-none text-center focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="bg-slate-950/50 rounded-2xl p-2 border border-slate-800/50 flex flex-col items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 text-center">{t.reps}</label>
                  <input 
                    type="text"
                    value={ex.targetReps}
                    onChange={e => updateExercise(i, 'targetReps', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-white font-bold focus:outline-none text-center focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="bg-slate-950/50 rounded-2xl p-2 border border-slate-800/50 flex flex-col items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 text-center">{t.rest}</label>
                  <div className="relative flex items-center w-full">
                    <input 
                      type="number"
                      min="0"
                      value={ex.restTime}
                      onChange={e => updateExercise(i, 'restTime', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-white font-bold focus:outline-none text-center focus:border-blue-500 transition-colors text-sm pr-6"
                    />
                    <span className="absolute right-1.5 text-[9px] font-bold text-slate-500 pointer-events-none">sn</span>
                  </div>
                </div>
                <div className="bg-slate-950/50 rounded-2xl p-2 border border-slate-800/50 flex flex-col items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 text-center">{t.duration}</label>
                  <div className="relative flex items-center w-full">
                    <input 
                      type="number"
                      min="0"
                      value={ex.targetTime || ''}
                      placeholder="-"
                      onChange={e => updateExercise(i, 'targetTime', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-white font-bold focus:outline-none text-center focus:border-blue-500 transition-colors text-sm pr-6 placeholder-slate-600"
                    />
                    <span className="absolute right-1.5 text-[9px] font-bold text-slate-500 pointer-events-none">sn</span>
                  </div>
                </div>
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
        {error && (
          <div className="mb-3 text-red-400 text-sm font-bold text-center bg-red-400/10 py-2 px-4 rounded-xl">
            {error}
          </div>
        )}
        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Save size={20} /> {t.save}
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
