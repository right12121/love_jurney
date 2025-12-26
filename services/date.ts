import { DayStats } from '../types';

const START_DATE = new Date("2022-05-23T00:00:00+08:00");

export function getDaysTogether(): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - START_DATE.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

export function getDayIndex(dateStr: string): number {
  const date = new Date(dateStr);
  const diffTime = date.getTime() - START_DATE.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 1; // 1-based index
}

export function calculateDetailedStats(): DayStats {
  const totalDays = getDaysTogether();
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = (totalDays % 365) % 30;
  
  return {
    daysTogether: totalDays,
    years,
    months,
    days
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
}
