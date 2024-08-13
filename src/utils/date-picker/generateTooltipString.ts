const generateDaySuffix = (day: string) => {
  const lastDigit = day[day.length - 1];

  switch (lastDigit) {
    case "1":
      return "st";
    case "2":
      return "nd";
    case "3":
      return "rd";
    default:
      return "th";
  }
};

/* date "01-01" => "Janurary 1st" */
export const generateTooltipString = (date: string) => {
  const [month, day] = date.split("-");

  const monthStr = new Date(0, parseInt(month) - 1).toLocaleString("en-US", {
    month: "long",
  });

  const suffix = generateDaySuffix(day);

  return `${monthStr} ${parseInt(day)}${suffix}`;
};
