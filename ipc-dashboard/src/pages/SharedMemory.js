import React from "react";
import "./pages.css";

function SharedMemory() {
  return (
    <div className="page-container">
      <h1 className="page-title">Shared Memory</h1>

      <div className="section">
        <h2 className="section-title">Shared Memory Blocks</h2>
        <p className="section-content">
          Inspect shared memory segments used by system processes and IPC components.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Memory Blocks</h2>

        <table className="table-style">
          <thead>
            <tr>
              <th>Block ID</th>
              <th>Size</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>mem_blk_01</td>
              <td>2MB</td>
              <td>Process A</td>
              <td>Active</td>
            </tr>

            <tr>
              <td>mem_blk_02</td>
              <td>5MB</td>
              <td>Process B</td>
              <td>Idle</td>
            </tr>

            <tr>
              <td>mem_blk_03</td>
              <td>10MB</td>
              <td>Process C</td>
              <td>Idle</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SharedMemory;
