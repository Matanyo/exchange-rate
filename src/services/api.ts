import axios from "axios";
import { API_CONFIG } from "../config/api";

interface ExchangeRateResponse {
  rates: {
    [currency: string]: number;
  };
  base: string;
  date: string;
}

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  params: {
    app_id: API_CONFIG.APP_ID,
  },
});

export const fetchExchangeRate = async (
  date: string
): Promise<ExchangeRateResponse> => {
  try {
    const response = await api.get<ExchangeRateResponse>(
      `/historical/${date}.json`,
      {
        params: {
          app_id: API_CONFIG.APP_ID,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API request failed", error);
    throw new Error("Failed to fetch exchange rate data");
  }
};
