import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatDateForDisplay } from "../utils/dateUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ExchangeRateChartProps {
  dates: Date[];
  rates: number[];
  baseCurrency: string;
  targetCurrency: string;
}

export const ExchangeRateChart = ({
  dates,
  rates,
  baseCurrency,
  targetCurrency,
}: ExchangeRateChartProps) => {
  const percentageChanges = rates.map((rate, index) => {
    if (index === 0) return 0;
    const previousRate = rates[index - 1];
    return ((rate - previousRate) / previousRate) * 100;
  });

  const data = {
    labels: dates.map((date) => formatDateForDisplay(date)),
    datasets: [
      {
        label: `${baseCurrency} to ${targetCurrency} Rate`,
        data: rates,
        borderColor: "rgb(75, 192, 192)",
        yAxisID: "y",
      },
      {
        label: "Daily Change %",
        data: percentageChanges,
        borderColor: "rgb(255, 99, 132)",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Exchange Rate and Daily Change",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: `${targetCurrency} per ${baseCurrency}`,
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Change %",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow p-4">
      <Line options={options} data={data} />
    </div>
  );
};
