// src/App.js
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import SystemOverview from "./pages/SystemOverview";
import ActivePipes from "./pages/ActivePipes";
import MessageQueues from "./pages/MessageQueues";
import SharedMemory from "./pages/SharedMemory";
import SecurityACLs from "./pages/SecurityACLs";
import SystemLogs from "./pages/SystemLogs";
import Configuration from "./pages/Configuration";

import "./styles.css";

function App() {
  const [page, setPage] = useState("System Overview");

  const renderPage = () => {
    switch (page) {
      case "System Overview": return <SystemOverview />;
      case "Active Pipes": return <ActivePipes />;
      case "Message Queues": return <MessageQueues />;
      case "Shared Memory": return <SharedMemory />;
      case "Security & ACLs": return <SecurityACLs />;
      case "System Logs": return <SystemLogs />;
      case "Configuration": return <Configuration />;
      default: return <SystemOverview />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onSelect={setPage} />
      <div className="content">
        <Topbar title={page} />
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
