export interface WeekendWindow {
  start: Date;
  end: Date;
}

export const getCurrentWeekendWindow = (referenceDate: Date = new Date()): WeekendWindow => {
  const start = new Date(referenceDate);
  const day = start.getDay();

  if (day >= 4) {
    start.setDate(start.getDate() - (day - 4));
  } else {
    start.setDate(start.getDate() + (4 - day));
  }

  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 2);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const isWithinCurrentWeekend = (date: Date, referenceDate: Date = new Date()): boolean => {
  const { start, end } = getCurrentWeekendWindow(referenceDate);
  return date >= start && date <= end;
};
