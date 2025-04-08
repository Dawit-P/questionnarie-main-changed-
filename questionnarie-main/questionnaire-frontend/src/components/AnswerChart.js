import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import randomColor from "randomcolor";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const AnswerChart = ({ questionText, answers, chartType = "bar", size = { width: "400px", height: "300px" } }) => {
  // Count the frequency of each answer
  const answerCounts = answers.reduce((acc, answer) => {
    acc[answer.answerText] = (acc[answer.answerText] || 0) + 1;
    return acc;
  }, {});

  // Generate unique colors for each answer
  const colors = randomColor({
    count: Object.keys(answerCounts).length,
    luminosity: "bright",
  });

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(answerCounts),
    datasets: [
      {
        label: "Number of Answers",
        data: Object.values(answerCounts),
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("0.6", "1")),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: questionText,
      },
    },
  };

  return (
    <div style={{ width: size.width, height: size.height }}>
      {chartType === "bar" ? (
        <Bar data={chartData} options={chartOptions} />
      ) : chartType === "pie" ? (
        <Pie data={chartData} options={chartOptions} />
      ) : chartType === "line" ? (
        <Line data={chartData} options={chartOptions} />
      ) : null}
    </div>
  );
};

export default AnswerChart;