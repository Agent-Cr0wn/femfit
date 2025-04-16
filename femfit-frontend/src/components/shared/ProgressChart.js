import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ProgressChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Format data for chart if provided
    if (data && data.length > 0) {
      const formattedData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        weight: item.weight,
        bodyFat: item.body_fat
      }));
      setChartData(formattedData);
    } else {
      // Sample data if no data provided
      const sampleData = [
        { date: '1/1/2023', weight: 165, bodyFat: 25 },
        { date: '1/8/2023', weight: 163, bodyFat: 24 },
        { date: '1/15/2023', weight: 161, bodyFat: 23.5 },
        { date: '1/22/2023', weight: 159, bodyFat: 23 },
        { date: '1/29/2023', weight: 157, bodyFat: 22.5 }
      ];
      setChartData(sampleData);
    }
  }, [data]);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="weight"
          stroke="#7D1935"
          activeDot={{ r: 8 }}
          name="Weight"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="bodyFat"
          stroke="#555555"
          name="Body Fat %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;