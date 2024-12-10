import { addDays, isAfter, subDays } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "../config/date";

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onRangeChange: (startDate: Date, endDate: Date) => void;
  onSubmit: () => void;
}

export const DateRangeSelector = ({
  startDate,
  endDate,
  onRangeChange,
  onSubmit,
}: DateRangeSelectorProps) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    const newEnd = addDays(newStart, MAX_DATE_RANGE_DAYS);

    if (isAfter(newEnd, new Date())) {
      const adjustedEnd = new Date();
      const adjustedStart = subDays(adjustedEnd, MAX_DATE_RANGE_DAYS);
      onRangeChange(adjustedStart, adjustedEnd);
    } else {
      onRangeChange(newStart, newEnd);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    const newStart = subDays(newEnd, MAX_DATE_RANGE_DAYS);
    onRangeChange(newStart, newEnd);
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <label htmlFor="startDate">From:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={handleStartDateChange}
          max={endDate}
          className="border rounded p-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="endDate">To:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate}
          max={new Date().toISOString().split("T")[0]}
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update Chart
      </button>
    </div>
  );
};
