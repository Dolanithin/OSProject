// src/components/Sidebar.js
import { useState } from "react";
import { FaNetworkWired, FaBars, FaShieldAlt, FaDatabase, FaWaveSquare, FaServer } from "react-icons/fa";

export default function Sidebar({ onSelect }) {
  const [active, setActive] = useState("System Overview");

  const menu = [
    "System Overview",
    "Active Pipes",
    "Message Queues",
    "Shared Memory",
    "Security & ACLs",
    "System Logs",
    "Configuration"
  ];

  function handleClick(item) {
    setActive(item);
    onSelect(item);
  }

  return (
    <div className="sidebar">
      <div className="brand">
        <div className="logo">⚙️</div>
        <h2>Nexus</h2>
      </div>

      {menu.map(m => (
        <div key={m}
             className={`menu-item ${active === m ? "active" : ""}`}
             onClick={() => handleClick(m)}>
          <div className="icon">{/* optional icon */}</div>
          <div>{m}</div>
        </div>
      ))}
    </div>
  );
}
