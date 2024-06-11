import { generateTooltipString } from "./generateTooltipString";

export function generateDataForCells(
  dates: string[],
  activeDates: string[],
  selectedYear: number
) {
  let weekIndex = 0;

  return dates.map(date => {
    let isActive = false;
    let slug = null;

    const acitveDate = activeDates.find(d => d === date);
    if (acitveDate) {
      isActive = true;
      slug = `${selectedYear}/${date}`;
    }

    if (date.startsWith("12")) {
      if (weekIndex < 3) {
        weekIndex = 3;
      }

      if (new Date(`${selectedYear}-${date}`).getDay() === 0 && weekIndex < 7) {
        weekIndex++;
      }
    }

    if (date.startsWith("11")) {
      if (new Date(`${selectedYear}-${date}`).getDay() === 0 && weekIndex < 2) {
        weekIndex++;
      }
    }

    const tooltip = generateTooltipString(date);

    return {
      tooltip,
      isActive,
      slug,
      weekIndex,
    };
  });
}
