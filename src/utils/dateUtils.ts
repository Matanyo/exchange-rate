import { format } from "date-fns";

export const formatDateForApi = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const formatDateForDisplay = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};
