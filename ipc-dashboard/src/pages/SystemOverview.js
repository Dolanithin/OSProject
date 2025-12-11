// src/pages/SystemOverview.js
import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import LiveThroughputChart from "../components/LiveThroughputChart";
import ActiveProcessesTable from "../components/ActiveProcessesTable";
import { FaMicrochip, FaDatabase, FaWaveSquare, FaShareAlt } from "react-icons/fa";

export default function SystemOverview() {
  const [cpu, setCpu] = useState(14.7);
  const [mem, setMem] = useState(69.6);
  const [throughput, setThroughput] = useState(2.0);
  const [activeIpcs, setActiveIpcs] = useState(85);

  // Simulate live updates
  useEffect(() => {
    const t = setInterval(() => {
      setCpu((Math.random()*15 + 7).toFixed(1));
      setMem((Math.random()*20 + 60).toFixed(1));
      setThroughput((Math.random()*3 + 0.6).toFixed(1));
      setActiveIpcs((Math.floor(Math.random()*30)+60));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page">
      <div className="topbar">
        <div className="title">System Overview</div>
        <div className="controls">
          <input placeholder="Filter processes..." style={{
            padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"none", borderRadius:10, color:"#cfeff6", outline:"none"
          }}/>
          <button style={{
            width:42, height:42, borderRadius:10, background:"#08b3c7", border:"none", color:"#01222b", fontWeight:700, cursor:"pointer"
          }}>+</button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="CPU USAGE" value={cpu} unit="%" pct={Math.min(100, cpu)} icon={<FaMicrochip />} />
        <StatCard label="MEMORY LOAD" value={mem} unit="%" pct={Math.min(100, mem)} icon={<FaDatabase />} />
        <StatCard label="THROUGHPUT" value={throughput} unit="GB/s" pct={Math.min(100, (throughput / 6) * 100)} icon={<FaWaveSquare />} />
        <StatCard label="ACTIVE IPCS" value={activeIpcs} unit="count" pct={Math.min(100, (activeIpcs / 150) * 100)} icon={<FaShareAlt />} />
      </div>

      <LiveThroughputChart />

      <ActiveProcessesTable />
    </div>
  );
}
