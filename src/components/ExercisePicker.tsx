import { useState, useMemo } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { EXERCISES } from '../data';
import { Exercise } from '../types';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';

export function ExercisePicker({ onPick, onClose }: { onPick: (ex: Exercise) => void, onClose: () => void }) {
  const { lang } = useAppContext();
  const t = translations[lang];
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return EXERCISES.filter(e => 
      e.name[lang].toLowerCase().includes(q) || 
      e.muscle[lang].toLowerCase().includes(q)
    );
  }, [query, lang]);

  // Group by muscle
  const groups = useMemo(() => {
    const map = new Map<string, Exercise[]>();
    filtered.forEach(ex => {
      const muscle = ex.muscle[lang];
      if (!map.has(muscle)) map.set(muscle, []);
      map.get(muscle)!.push(ex);
    });
    return Array.from(map.entries());
  }, [filtered, lang]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 max-w-md mx-auto border-x border-slate-900/50 animate-in slide-in-from-bottom-full duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-950">
        <h2 className="text-lg font-extrabold text-white">{t.addExercise}</h2>
        <button onClick={onClose} className="p-2 bg-slate-800/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="p-4 bg-slate-950">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            autoFocus
            type="text"
            placeholder={t.searchEx}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-blue-500/30 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500 font-medium"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pt-0 hide-scrollbar">
        {groups.map(([muscle, items]) => (
          <div key={muscle} className="space-y-2">
            <h3 className="text-[11px] font-extrabold text-blue-500 uppercase tracking-widest pl-1">{muscle}</h3>
            <div className="space-y-2">
              {items.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => onPick(ex)}
                  className="w-full flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800/80 hover:bg-slate-800 transition-colors text-left"
                >
                  <div>
                    <div className="text-white font-bold text-sm mb-0.5">{ex.name[lang]}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{ex.muscle[lang]}</div>
                  </div>
                  <Plus className="text-slate-500" size={18} />
                </button>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-center text-slate-500 mt-10 text-sm font-medium">{t.notFound}</div>
        )}
      </div>
    </div>
  );
}
