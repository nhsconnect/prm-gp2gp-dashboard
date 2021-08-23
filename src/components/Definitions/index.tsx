import React from "react";

export const DefinitionsContent = () => (
  <div className="nhsuk-u-reading-width">
    <h3>Successful integrations</h3>
    <p>All GP2GP transfers that were:</p>
    <ul>
      <li>
        requested by the practice between the 1st and last day of the month, and
      </li>
      <li>
        integrated (filed or suppressed) by the receiving practice within 14
        days
      </li>
    </ul>
    <p>It does not include GP2GP transfers that:</p>
    <ul>
      <li>failed to transfer, or</li>
      <li>were rejected by the receiving practice, or</li>
      <li>were not integrated by the receiving practice within 14 days</li>
    </ul>
    <h3>Integrated within 3 days</h3>
    <p>
      The percentage of successful integrations that were integrated (filed or
      suppressed) within 3 days of the record being sent.
    </p>
    <p>
      3 days is considered best practice for integrating or suppressing records
      transferred via GP2GP.
    </p>
    <h3>Integrated within 8 days</h3>
    <p>
      The percentage of successful integrations that were integrated (filed or
      suppressed) within 8 days of the record being sent.
    </p>
    <h3>Integrated beyond 8 days</h3>
    <p>
      The percentage of successful integrations that were integrated (filed or
      suppressed) beyond 8 days of the record being sent.
    </p>
    <p>
      When records are not integrated within 8 days, GP2GP requests that a full
      paper copy is printed and sent to the practice.
    </p>
  </div>
);
