import { api } from "./api";
import { formatDateForApi } from "../utils/dateUtils";
import { eachDayOfInterval } from "date-fns";

interface ExchangeRateResponse {
  rates: {
    [currency: string]: number;
  };
  base: string;
  date: string;
}

interface RateCache {
  rate: number;
}

interface HistoricalRate {
  date: Date;
  rate: number;
}

interface CacheHandlers {
  getCachedRate: (date: Date, base: string, target: string) => RateCache | null;
  setCachedRate: (
    date: Date,
    base: string,
    target: string,
    rate: number
  ) => void;
}

interface HistoricalRatesParams extends CacheHandlers {
  baseCurrency: string;
  targetCurrency: string;
  startDate: Date;
  endDate: Date;
}

export const getHistoricalExchangeRates = async ({
  baseCurrency,
  targetCurrency,
  startDate,
  endDate,
  getCachedRate,
  setCachedRate,
}: HistoricalRatesParams): Promise<HistoricalRate[]> => {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  try {
    const responses = await Promise.all(
      dates.map(async (date) => {
        const cached = getCachedRate(date, baseCurrency, targetCurrency);
        if (cached) {
          return { data: { rates: { [targetCurrency]: cached.rate } } };
        }

        const response = await api.get<ExchangeRateResponse>(
          `/historical/${formatDateForApi(date)}.json`,
          {
            params: {
              base: baseCurrency,
              symbols: targetCurrency,
            },
          }
        );

        setCachedRate(
          date,
          baseCurrency,
          targetCurrency,
          response.data.rates[targetCurrency]
        );
        return response;
      })
    );

    return responses.map((response, index) => ({
      date: dates[index],
      rate: response.data.rates[targetCurrency],
    }));
  } catch (error) {
    console.error("Error fetching historical exchange rates:", error);
    throw error;
  }
};
