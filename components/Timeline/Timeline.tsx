import React from 'react';
import { MemoryItem } from '../../types';
import { SmartCanvas } from './SmartCanvas';
import { formatDate } from '../../services/date';

interface TimelineProps {
  memories: MemoryItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ memories }) => {
  if (memories.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Your journey begins now. Add your first memory!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 py-8">
      {/* Vertical Line */}
      <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-pink-200 transform md:-translate-x-1/2"></div>

      <div className="flex flex-col gap-12">
        {memories.map((memory, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={memory.id} className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Dot */}
              <div className="absolute left-[16px] md:left-1/2 w-3 h-3 bg-pink-400 rounded-full border-4 border-white shadow-sm transform md:-translate-x-1/2 z-10 top-8"></div>

              {/* Date Badge (Mobile: Left next to dot, Desktop: Opposite side) */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 md:px-8 mb-4 md:mb-0 text-left ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                 <div className="inline-block bg-white px-3 py-1 rounded-full shadow-sm border border-pink-100 text-sm font-semibold text-pink-500 mb-1">
                   Day {memory.dayIndex}
                 </div>
                 <div className="text-slate-500 text-sm pl-1">{formatDate(memory.date)}</div>
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2 pl-8 md:px-8">
                 <SmartCanvas htmlContent={memory.generatedHtml} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
