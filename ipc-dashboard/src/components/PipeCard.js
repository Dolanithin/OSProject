export default function PipeCard({ name, usage }) {
  return (
    <div className="pipe-card">
      <div className="pipe-title">{name}</div>
      <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
        /tmp/nexus/{name}.sock
      </div>

      <div className="progress-container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Buffer Usage</span>
          <span>{usage}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${usage}%` }}
          ></div>
        </div>
      </div>

      <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>
        Mode: FIFO • Size: 4MB
      </div>
    </div>
  );
}
