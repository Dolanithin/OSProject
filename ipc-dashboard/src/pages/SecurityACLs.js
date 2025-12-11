import React from "react";
import "./pages.css";

function SecurityACLs() {
  return (
    <div className="page-container">
      <h1 className="page-title">Security & ACLs</h1>

      <div className="section">
        <h2 className="section-title">Access Control Policies</h2>
        <p className="section-content">
          Manage permissions and access rules across IPC endpoints and shared memory.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">ACL Table</h2>

        <table className="table-style">
          <thead>
            <tr>
              <th>Resource</th>
              <th>User</th>
              <th>Permission</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>video_pipe_01</td>
              <td>root</td>
              <td>Read / Write</td>
            </tr>

            <tr>
              <td>queue_01</td>
              <td>system</td>
              <td>Read</td>
            </tr>

            <tr>
              <td>queue_02</td>
              <td>system</td>
              <td>Write</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SecurityACLs;
