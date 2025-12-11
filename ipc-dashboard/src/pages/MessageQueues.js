import React from "react";
import "./pages.css";

function MessageQueues() {
  return (
    <div className="page-container">
      <h1 className="page-title">Message Queues</h1>

      <div className="section">
        <h2 className="section-title">Overview</h2>
        <p className="section-content">
          View and manage active message queues, producers, consumers and queue depth.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Queue Statistics</h2>

        <table className="table-style">
          <thead>
            <tr>
              <th>Queue Name</th>
              <th>Messages</th>
              <th>Consumers</th>
              <th>Latency</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>queue_01</td>
              <td>128</td>
              <td>3</td>
              <td>8ms</td>
            </tr>

            <tr>
              <td>queue_02</td>
              <td>54</td>
              <td>1</td>
              <td>12ms</td>
            </tr>

            <tr>
              <td>queue_03</td>
              <td>78</td>
              <td>5</td>
              <td>33ms</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default MessageQueues;
