// components/analytics/Dashboard.js
import { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [batchData, setBatchData] = useState([]);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    fetchBatchData();
  }, [timeRange]);

  const fetchBatchData = async () => {
    const res = await fetch(`/api/analytics?range=${timeRange}`);
    const data = await res.json();
    setBatchData(data);
  };

  const expenseData = {
    labels: batchData.map((batch) => batch.name),
    datasets: [
      {
        label: "Expenses",
        data: batchData.map((batch) => batch.totalExpenses),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Earnings",
        data: batchData.map((batch) => batch.totalEarnings),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const profitData = {
    labels: batchData.map((batch) => batch.name),
    datasets: [
      {
        label: "Profit/Loss",
        data: batchData.map((batch) => batch.totalEarnings - batch.totalExpenses),
        backgroundColor: batchData.map((batch) => 
          (batch.totalEarnings - batch.totalExpenses) >= 0 
            ? "rgba(75, 192, 192, 0.5)" 
            : "rgba(255, 99, 132, 0.5)"
        ),
      },
    ],
  };

  const expenseByCategory = batchData.reduce((acc, batch) => {
    batch.expensesByCategory.forEach(({ category, total }) => {
      if (!acc[category]) acc[category] = 0;
      acc[category] += total;
    });
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(expenseByCategory),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="mb-6">
        <select 
          className="border p-2 rounded"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Expenses vs Earnings</h2>
          <Bar data={expenseData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Profit/Loss by Batch</h2>
          <Bar data={profitData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
          <Pie data={categoryData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Profit Trend</h2>
          <Line data={{
            labels: batchData.map(batch => new Date(batch.startDate).toLocaleDateString()),
            datasets: [{
              label: "Profit Trend",
              data: batchData.map(batch => batch.totalEarnings - batch.totalExpenses),
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1
            }]
          }} />
        </div>
      </div>
    </div>
  );
}