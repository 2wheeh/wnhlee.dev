interface Props {
  years: number[];
  selectedYear?: number;
}

export function DatePicker({ years, selectedYear }: Props) {
  return (
    <div>
      <div>
        years:
        {years.map(year => (
          <div>
            <a href={`/logs/${year}`}>{year}</a>
            {year === selectedYear && <span> selected</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
