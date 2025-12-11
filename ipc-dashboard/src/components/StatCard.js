// src/components/StatCard.js
import React from "react";

export default function StatCard({ label, value, unit, pct, icon }) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div className="label">{icon ? <span style={{marginRight:8}}>{icon}</span> : null}{label}</div>
          <div className="value">
            {value} {unit && <span style={{ fontSize:16, fontWeight:500, color:"#a6dfe7" }}>{unit}</span>}
          </div>
          <div className="small-muted"> {label === "THROUGHPUT" ? "GB/s" : ""}</div>
        </div>

        {/* small square icon */}
        <div style={{ width:40, height:40, borderRadius:10, background:"rgba(255,255,255,0.03)", display:"flex",
                      alignItems:"center", justifyContent:"center", color:"#9ee9ff", fontSize:18 }}>
          {icon}
        </div>
      </div>

      <div className="card-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
