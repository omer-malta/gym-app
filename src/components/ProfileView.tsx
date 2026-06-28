import { useState, useMemo } from 'react';
import { ArrowLeft, User as UserIcon, Settings, Calendar, Activity, TrendingUp, Scale, Plus, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Measurement } from '../types';

type MeasurementType = 'weight' | 'chest' | 'shoulders' | 'arms' | 'legs' | 'waist' | 'bodyFat';

const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  weight: 'Bodyweight',
  chest: 'Chest',
  shoulders: 'Shoulders',
  arms: 'Arms',
  legs: 'Legs',
  waist: 'Waist',
  bodyFat: 'Body Fat'
};

const MEASUREMENT_UNITS: Record<MeasurementType, string> = {
  weight: 'kg',
  chest: 'cm',
  shoulders: 'cm',
  arms: 'cm',
  legs: 'cm',
  waist: 'cm',
  bodyFat: '%'
};

export function ProfileView({ onBack }: { onBack: () => void }) {
  const { user, workouts, measurements, addMeasurement, lang, logout } = useAppContext();
  const t = translations[lang];

  const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementType>('weight');
  const [showMeasurementInput, setShowMeasurementInput] = useState(false);
  const [newMeasurementValue, setNewMeasurementValue] = useState('');
  const [showMeasurementDropdown, setShowMeasurementDropdown] = useState(false);

  // Prepare chart data (Workout Volume over time)
  const chartData = useMemo(() => {
    return [...workouts]
      .sort((a, b) => a.startTime - b.startTime)
      .slice(-10) // last 10 workouts
      .map((w, i) => {
        const volume = w.exercises.reduce((acc, ex) => {
          return acc + ex.sets.reduce((setAcc, set) => {
            if (set.completed && set.weight && set.reps) {
              return setAcc + (parseFloat(set.weight) * parseInt(set.reps));
            }
            return setAcc;
          }, 0);
        }, 0);
        
        return {
          name: new Date(w.startTime).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' }),
          volume: volume
        };
      });
  }, [workouts, lang]);

  // Calendar Heatmap data (last 28 days)
  const heatmapData = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      const dayWorkouts = workouts.filter(w => {
        const wd = new Date(w.startTime);
        return wd.getFullYear() === d.getFullYear() && wd.getMonth() === d.getMonth() && wd.getDate() === d.getDate();
      });
      
      days.push({
        date: d,
        count: dayWorkouts.length
      });
    }
    return days;
  }, [workouts]);

  const handleAddMeasurement = () => {
    if (!newMeasurementValue || isNaN(Number(newMeasurementValue))) return;
    
    const newMeasurement: Measurement = {
      id: Math.random().toString(36).substring(7),
      date: Date.now(),
      [selectedMeasurement]: parseFloat(newMeasurementValue)
    };

    addMeasurement(newMeasurement);
    setNewMeasurementValue('');
    setShowMeasurementInput(false);
  };

  const relevantMeasurements = measurements 
    ? [...measurements].filter(m => m[selectedMeasurement] !== undefined).sort((a, b) => b.date - a.date)
    : [];

  const latestValue = relevantMeasurements.length > 0 ? relevantMeasurements[0][selectedMeasurement] : null;

  const measurementChartData = useMemo(() => {
    return [...relevantMeasurements]
      .sort((a, b) => a.date - b.date)
      .map(m => ({
        name: new Date(m.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' }),
        value: m[selectedMeasurement]
      }));
  }, [relevantMeasurements, selectedMeasurement, lang]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 h-full relative z-10">
      <div className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-10 border-b border-white/5">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors -ml-2"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-white font-bold text-lg">Profile</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-6 space-y-8">
        
        {/* User Info */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-4xl shadow-[0_0_25px_rgba(59,130,246,0.5)] ring-4 ring-slate-950 mb-4 relative">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h1 className="text-2xl font-black text-white mb-1">{user?.name}</h1>
          <p className="text-slate-400 text-sm font-medium">{workouts.length} total workouts</p>
        </div>

        {/* Charts */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-2 flex items-center gap-2">
            <TrendingUp size={14} /> Volume Over Time
          </h3>
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-[20px] p-4 shadow-sm h-56 pt-6">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">Not enough data</div>
            )}
          </div>
        </div>

        {/* Calendar Activity */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-2 flex items-center gap-2">
            <Calendar size={14} /> Activity Grid
          </h3>
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-[20px] p-5 shadow-sm">
             <div className="grid grid-cols-7 gap-2">
                {heatmapData.map((day, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-md flex items-center justify-center text-[10px] ${day.count > 0 ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-800/50 text-transparent'}`}
                    title={`${day.date.toLocaleDateString()}: ${day.count} workouts`}
                  >
                  </div>
                ))}
             </div>
             <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 font-medium px-1">
               <span>28 days ago</span>
               <span>Today</span>
             </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="space-y-3 pb-8">
          <div className="flex items-center justify-between pl-2">
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Scale size={14} /> Measurements
            </h3>
            <button 
              onClick={() => setShowMeasurementInput(!showMeasurementInput)}
              className="text-blue-500 hover:text-blue-400 p-1"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-[20px] p-5 shadow-sm">
            {/* Measurement Selector */}
            <div className="relative mb-5 z-20">
              <button 
                onClick={() => setShowMeasurementDropdown(!showMeasurementDropdown)}
                className="w-full flex items-center justify-between bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                <span>{MEASUREMENT_LABELS[selectedMeasurement]}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${showMeasurementDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showMeasurementDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden py-1">
                  {(Object.keys(MEASUREMENT_LABELS) as MeasurementType[]).map(type => (
                     <button
                       key={type}
                       onClick={() => {
                         setSelectedMeasurement(type);
                         setShowMeasurementDropdown(false);
                         setShowMeasurementInput(false);
                       }}
                       className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${selectedMeasurement === type ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-white/5'}`}
                     >
                       {MEASUREMENT_LABELS[type]}
                     </button>
                  ))}
                </div>
              )}
            </div>

            {showMeasurementInput && (
              <div className="flex gap-2 mb-6 animate-in fade-in zoom-in duration-200 relative z-10">
                <input
                  type="number"
                  value={newMeasurementValue}
                  onChange={(e) => setNewMeasurementValue(e.target.value)}
                  placeholder={`${MEASUREMENT_LABELS[selectedMeasurement]} (${MEASUREMENT_UNITS[selectedMeasurement]})`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 text-sm"
                  autoFocus
                />
                <button 
                  onClick={handleAddMeasurement}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-bold transition-colors text-sm"
                >
                  Save
                </button>
              </div>
            )}
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-white">{latestValue || '--'}</span>
              <span className="text-slate-500 font-bold">{MEASUREMENT_UNITS[selectedMeasurement]}</span>
            </div>
            
            {/* Chart for specific measurement */}
            {measurementChartData.length > 1 && (
               <div className="h-32 -mx-2 mb-4 mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={measurementChartData}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                 </ResponsiveContainer>
               </div>
            )}

            {relevantMeasurements.length > 0 ? (
              <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
                {relevantMeasurements.slice(0, 5).map(m => (
                  <div key={m.id} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                    <span className="text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                    <span className="text-white font-medium">{m[selectedMeasurement]} {MEASUREMENT_UNITS[selectedMeasurement]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-4 text-sm mt-4 border-t border-white/5">
                No {MEASUREMENT_LABELS[selectedMeasurement].toLowerCase()} records.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
