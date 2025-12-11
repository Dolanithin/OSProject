import React from "react";
import "./pages.css";

function ActivePipes() {
  return (
    <div className="page-container">
      <h1 className="page-title">Active Pipes</h1>

      <div className="section">
        <h2 className="section-title">Pipe Statistics</h2>
        <p className="section-content">
          Monitor active IPC pipes, buffer usage and connection status in real time.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Active Pipes Table</h2>

        <table className="table-style">
          <thead>
            <tr>
              <th>Pipe Name</th>
              <th>Mode</th>
              <th>Buffer Size</th>
              <th>Usage</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>video_pipe_01</td>
              <td>FIFO</td>
              <td>4MB</td>
              <td>17%</td>
            </tr>

            <tr>
              <td>video_pipe_02</td>
              <td>FIFO</td>
              <td>4MB</td>
              <td>28%</td>
            </tr>

            <tr>
              <td>video_pipe_03</td>
              <td>LIFO</td>
              <td>5MB</td>
              <td>38%</td>
            </tr>
            
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ActivePipes;
