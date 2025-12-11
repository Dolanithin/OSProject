// src/components/ActiveProcessesTable.js
import React from "react";

const sample = [
  { pid: 4120, name: "video_encoder_d", type: "Pipe (Write)", status: "Active", uptime: "4h 22m" },
  { pid: 4121, name: "stream_muxer", type: "Pipe (Read)", status: "Active", uptime: "4h 22m" },
  { pid: 8092, name: "log_aggregator", type: "Queue (Sub)", status: "Idle", uptime: "12d 4h" },
  { pid: 3321, name: "game_state_sync", type: "Shm (RW)", status: "Active", uptime: "45m" },
  { pid: 1102, name: "auth_daemon", type: "Socket", status: "Active", uptime: "15d" }
];

export default function ActiveProcessesTable({ data = sample }) {
  return (
    <div className="table-card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{fontWeight:700, color:"#dff7ff"}}>Active Processes</div>
        <div style={{color:"#7eaebc"}}>•••</div>
      </div>

      <table className="table" aria-label="Active Processes">
        <thead>
          <tr>
            <th>PID</th>
            <th>PROCESS NAME</th>
            <th>TYPE</th>
            <th>STATUS</th>
            <th>UPTIME</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r,i) => (
            <tr key={i}>
              <td>{r.pid}</td>
              <td style={{fontWeight:700}}>{r.name}</td>
              <td><span className="tag">{r.type}</span></td>
              <td>
                <span className={`status-dot ${r.status === "Active" ? "status-active" : "status-idle"}`}></span>
                <span style={{ color: r.status === "Active" ? "#9fffd4" : "#f2db91" }}>{r.status}</span>
              </td>
              <td style={{ color:"#9fb0bd" }}>{r.uptime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
