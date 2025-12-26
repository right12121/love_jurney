import React, { useEffect, useState } from 'react';
import { calculateDetailedStats } from '../../services/date';
import { DayStats } from '../../types';

export const Header: React.FC = () => {
  const [stats, setStats] = useState<DayStats>(calculateDetailedStats());

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(calculateDetailedStats());
    }, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative w-full py-12 px-6 bg-gradient-to-b from-pink-100 to-slate-50 text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        {/* Decorative background circles */}
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-pink-500 font-medium tracking-widest text-sm uppercase mb-4">
          Our Love Journey
        </h2>
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-600 text-lg mb-2">We have been together for</span>
          <div className="relative">
             <h1 className="text-6xl md:text-8xl font-bold text-slate-800 font-handwriting">
              {stats.daysTogether}
            </h1>
            {stats.daysTogether === 1314 && (
              <span className="absolute -top-4 -right-8 text-2xl animate-bounce">❤️</span>
            )}
          </div>
          <span className="text-slate-500 text-xl mt-2">days</span>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-slate-400 text-sm font-light">
          <div>{stats.years} Years</div>
          <div>•</div>
          <div>{stats.months} Months</div>
          <div>•</div>
          <div>{stats.days} Days</div>
        </div>
      </div>
    </header>
  );
};
