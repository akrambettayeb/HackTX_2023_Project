// PieChart.tsx
import React, { useEffect, useRef } from "react";
import { Karla } from "next/font/google";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";

interface PieChartProps {
  labels: string[];
  data: number[];
}
Chart.defaults.plugins.legend.labels.color = "green";

const baseColors = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#9333EA",
  "#EC4899",
  "#6EE7B7",
  "#A78BFA",
  "#FBBF24",
  "#2DD4BF",
];

const generateColors = (numColors: number) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const PieChart: React.FC<PieChartProps> = ({ labels, data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        const colors = generateColors(data.length);
        chartInstanceRef.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  font: {
                    family: karla.style.fontFamily,
                    size: 25,
                  },
                  generateLabels: (chart) => {
                    return chart.data.labels!.map((label, index) => {
                      return {
                        text: `${label}: $${data[index]!.toFixed(2)}`,
                        fontColor: "#059669",
                        fillStyle: colors[index],
                        strokeStyle: colors[index],
                        lineWidth: 1,
                        hidden: isNaN(
                          chart.data.datasets[0]!.data[index] as number,
                        ),
                        index: index,
                      };
                    });
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const percentage = (
                      ((context.raw as number) /
                        data.reduce((acc, value) => acc + value, 0)) *
                      100
                    ).toFixed(2);
                    return `${context.label}: ${percentage}%`;
                  },
                },
              },
              datalabels: {
                display: false,
              },
            },
          },
        }) as any;
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, data]);

  return <canvas ref={chartRef}></canvas>;
};

export default PieChart;
