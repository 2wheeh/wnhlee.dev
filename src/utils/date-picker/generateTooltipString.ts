// string: "01-01" => "Janurary 1st"
export const generateTooltipString = (date: string) => {
  const [month, day] = date.split("-");

  const monthStr = new Date(0, parseInt(month) - 1).toLocaleString("en-US", {
    month: "long",
  });

  const suffix =
    day === "01" ? "st" : day === "02" ? "nd" : day === "03" ? "rd" : "th";

  return `${monthStr} ${parseInt(day)}${suffix}`;
};
