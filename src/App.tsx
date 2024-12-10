import { useState, useEffect, useCallback } from "react";
import { ExchangeRateChart } from "./components/ExchangeRateChart";
import { DateRangeSelector } from "./components/DateRangeSelector";
import { getHistoricalExchangeRates } from "./services/exchangeRateService";
import { subDays } from "date-fns";
import { useExchangeRateCache } from "./services/cacheService";
import { baseCurrency, targetCurrency } from "./config/currency";
function App() {
  const [historicalRates, setHistoricalRates] = useState<
    { date: Date; rate: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState({
    start: subDays(new Date(), 13).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [displayDates, setDisplayDates] = useState(selectedDates);

  const { getCachedRate, setCachedRate } = useExchangeRateCache();

  const fetchRates = useCallback(async (start: Date, end: Date) => {
    try {
      setIsLoading(true);
      const rates = await getHistoricalExchangeRates({
        baseCurrency,
        targetCurrency,
        startDate: start,
        endDate: end,
        getCachedRate: (date) =>
          getCachedRate({ date, baseCurrency, targetCurrency }),
        setCachedRate: (date, _, __, rate) =>
          setCachedRate({ date, baseCurrency, targetCurrency, rate }),
      });
      setHistoricalRates(rates);
    } catch (err) {
      setError("Failed to fetch exchange rates");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRangeChange = useCallback((start: Date, end: Date) => {
    setSelectedDates({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setDisplayDates(selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    if (historicalRates.length === 0) {
      fetchRates(new Date(displayDates.start), new Date(displayDates.end));
    }
  }, []);

  useEffect(() => {
    if (historicalRates.length > 0) {
      fetchRates(new Date(displayDates.start), new Date(displayDates.end));
    }
  }, [displayDates, fetchRates]);

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">
        USD to ILS Exchange Rate History (Two weeks)
      </h1>
      <DateRangeSelector
        startDate={selectedDates.start}
        endDate={selectedDates.end}
        onRangeChange={handleRangeChange}
        onSubmit={handleSubmit}
      />
      {!isLoading && !error && (
        <ExchangeRateChart
          dates={historicalRates.map((r) => r.date)}
          rates={historicalRates.map((r) => r.rate)}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
        />
      )}
      {isLoading && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
    </div>
  );
}

export default App;
