import { useEffect, useState } from "react";

export default function CpuUsage() {
  const [cpu, setCpu] = useState(35);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 20); 
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        background: "rgba(30, 30, 40, 0.7)",
        padding: "20px",
        borderRadius: "20px",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        width: "100%",
        marginBottom: "25px"
      }}
    >
      <h2 style={{ marginBottom: 10 }}>CPU Usage</h2>

      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${cpu}%` }}
        ></div>
      </div>

      <p style={{ opacity: 0.8, marginTop: 10 }}>{cpu}% used</p>
    </div>
  );
}
