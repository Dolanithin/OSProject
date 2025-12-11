// src/components/LiveThroughputChart.js
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

function randomData() {
  return Array.from({length: 40}).map((_,i) => ({ name: i, value: Math.round(Math.random()*80) + 10 }));
}

export default function LiveThroughputChart() {
  const [data, setData] = useState(randomData());

  useEffect(() => {
    const t = setInterval(() => {
      setData(randomData());
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="live-card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ color:"#9fdfe8", fontWeight:700, fontSize:16 }}>Live Throughput</div>
        <div style={{ color:"#9fb0bd", fontSize:13 }}>—</div>
      </div>

      <div style={{ width:"100%", height:200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis dataKey="name" tick={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6fa3b6" }} />
            <Tooltip wrapperStyle={{ background: "#051019", borderRadius:6, border:"1px solid rgba(255,255,255,0.04)" }} />
            <Bar dataKey="value" radius={[6,6,6,6]} fill="#0fd8ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
