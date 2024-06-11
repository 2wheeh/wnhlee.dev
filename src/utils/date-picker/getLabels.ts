export const getLabels = (type: "months" | "weekdays") => {
  if (type === "months") {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  }

  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
};
