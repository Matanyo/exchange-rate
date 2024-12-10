import { useLocalStorage } from "usehooks-ts";
import { formatDateForApi } from "../utils/dateUtils";

interface CachedRate {
  date: string;
  rate: number;
}

interface CacheKey {
  date: Date;
  baseCurrency: string;
  targetCurrency: string;
}

interface CacheSetParams extends CacheKey {
  rate: number;
}

interface CacheStore {
  [key: string]: CachedRate;
}

interface CacheService {
  getCachedRate: (params: CacheKey) => CachedRate | null;
  setCachedRate: (params: CacheSetParams) => void;
}

const CACHE_KEY = "exchange-rates-cache";

export const useExchangeRateCache = (): CacheService => {
  const [cache, setCache] = useLocalStorage<CacheStore>(CACHE_KEY, {});

  const getCacheKey = ({
    date,
    baseCurrency,
    targetCurrency,
  }: CacheKey): string =>
    `${formatDateForApi(date)}-${baseCurrency}-${targetCurrency}`;

  const getCachedRate = (params: CacheKey): CachedRate | null => {
    const key = getCacheKey(params);
    return cache[key] || null;
  };

  const setCachedRate = ({
    date,
    baseCurrency,
    targetCurrency,
    rate,
  }: CacheSetParams): void => {
    const key = getCacheKey({ date, baseCurrency, targetCurrency });
    setCache((prev) => ({
      ...prev,
      [key]: {
        date: formatDateForApi(date),
        rate,
      },
    }));
  };

  return { getCachedRate, setCachedRate };
};
