const addPad = (n: number) => (n < 10 ? `0${n}` : n);

export const generateDates = (months: number[], selectedYear: number) => {
  return months.flatMap(month =>
    Array.from(
      { length: new Date(selectedYear, month, 0).getDate() },
      (_, i) => `${addPad(month)}-${addPad(i + 1)}`
    )
  );
};
