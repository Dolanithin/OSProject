import React from "react";
import "./pages.css";

function Configuration() {
  return (
    <div className="page-container">
      <h1 className="page-title">Configuration</h1>

      <div className="section">
        <h2 className="section-title">System Configuration</h2>
        <p className="section-content">
          Adjust IPC settings, memory policies, performance modes and system limits.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Settings</h2>

        <table className="table-style">
          <tbody>
            <tr>
              <td>Max Pipes</td>
              <td>32</td>
            </tr>

            <tr>
              <td>Max Queue Depth</td>
              <td>500</td>
            </tr>

            <tr>
              <td>Max Threads</td>
              <td>1000</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Configuration;
