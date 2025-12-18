"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface OverviewProps {
  data: { name: string; total: number }[];
}

export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#000",
            border: "2px solid #000",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
          }}
          formatter={(value: number) => [`€${value.toFixed(2)}`, "Revenue"]}
        />
        <Bar
          dataKey="total"
          fill="#9D4EDD"
          radius={[4, 4, 0, 0]}
          className="hover:opacity-80"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
