import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { Dumbbell } from 'lucide-react';
import { cn } from '../utils';

export function AuthScreen() {
  const { login, lang, setLang } = useAppContext();
  const t = translations[lang];
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center selection:bg-blue-500/30">
      <div className="w-full max-w-md h-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-2xl border-x border-slate-900/50">
        
        {/* Background aesthetics */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        {/* Language Toggle */}
        <div className="absolute top-6 right-6 flex gap-2 z-20">
          <button 
            onClick={() => setLang('tr')} 
            className={cn("px-3 py-1 text-xs font-bold rounded-full transition-colors", lang === 'tr' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300")}
          >
            TR
          </button>
          <button 
            onClick={() => setLang('en')} 
            className={cn("px-3 py-1 text-xs font-bold rounded-full transition-colors", lang === 'en' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300")}
          >
            EN
          </button>
        </div>

        <div className="w-full relative z-10 flex flex-col items-center">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
              <Dumbbell className="text-white" size={36} />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{t.appTitle}</h1>
          </div>

          {/* Auth Card Container */}
          <div className="w-full">
            
            {/* Custom sliding toggle */}
            <div className="flex bg-slate-900/80 p-1.5 rounded-2xl mb-8 relative border border-slate-800/80 backdrop-blur-md">
              <div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-blue-600 rounded-xl transition-all duration-300 ease-out shadow-md"
                style={{ left: isLogin ? '6px' : 'calc(50% + 0px)' }}
              ></div>
              <button 
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-xl transition-colors relative z-10",
                  isLogin ? "text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {t.login}
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-xl transition-colors relative z-10",
                  !isLogin ? "text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {t.register}
              </button>
            </div>

            <div className="relative h-[320px] w-full overflow-hidden">
              {/* Sliding Container */}
              <div 
                className="absolute top-0 w-[200%] h-full flex transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ transform: isLogin ? 'translateX(0)' : 'translateX(-50%)' }}
              >
                
                {/* Login Form */}
                <div className="w-1/2 px-1 flex flex-col space-y-4">
                  <input 
                    type="email" 
                    placeholder={t.email} 
                    className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all placeholder-slate-600 font-medium"
                  />
                  <input 
                    type="password" 
                    placeholder={t.password} 
                    className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all placeholder-slate-600 font-medium"
                  />
                  <div className="flex justify-end pt-1">
                    <span className="text-sm text-blue-500 font-medium hover:text-blue-400 cursor-pointer">{t.forgotPassword}</span>
                  </div>
                  <div className="flex-1"></div>
                  <button 
                    onClick={login}
                    className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] mt-4"
                  >
                    {t.login}
                  </button>
                </div>

                {/* Register Form */}
                <div className="w-1/2 px-1 flex flex-col space-y-4">
                  <input 
                    type="text" 
                    placeholder={t.name} 
                    className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all placeholder-slate-600 font-medium"
                  />
                  <input 
                    type="email" 
                    placeholder={t.email} 
                    className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all placeholder-slate-600 font-medium"
                  />
                  <input 
                    type="password" 
                    placeholder={t.password} 
                    className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all placeholder-slate-600 font-medium"
                  />
                  <div className="flex-1"></div>
                  <button 
                    onClick={login}
                    className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] mt-4"
                  >
                    {t.register}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
