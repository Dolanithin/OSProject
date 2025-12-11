import React from "react";
import "./pages.css";

function SystemLogs() {
  return (
    <div className="page-container">
      <h1 className="page-title">System Logs</h1>

      <div className="section">
        <h2 className="section-title">Log Output</h2>
        <p className="section-content">
          Monitor real-time system activity, errors, IPC transactions and connection events.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Recent Logs</h2>

        <table className="table-style">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>17:50:21</td>
              <td>Pipe video_pipe_01 connected</td>
            </tr>

            <tr>
              <td>17:51:03</td>
              <td>Queue queue_02 updated</td>
            </tr>

            <tr>
              <td>17:51:33</td>
              <td>Queue queue_03 updated</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SystemLogs;
