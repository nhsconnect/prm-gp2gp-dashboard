import React from "react";

export const DefinitionsContent = () => (
  <div className="nhsuk-u-reading-width">
    <h2 className="nhsuk-u-margin-top-6">Definitions</h2>
    <h3>Transfers received</h3>
    <p>
      All GP2GP transfers that were requested by the practice between the 1st
      and last day of the month and successfully received.
    </p>
    <p>It does not include GP2GP transfers that:</p>
    <ul>
      <li>failed to transfer, or</li>
      <li>were rejected by the receiving practice</li>
    </ul>
    <h3>Integrated within 3 days</h3>
    <p>
      The percentage of transfers received that were integrated (filed or
      suppressed) within 3 days of the record being sent.
    </p>
    <p>
      3 days is considered best practice for integrating or suppressing records
      transferred via GP2GP.
    </p>
    <h3>Integrated within 8 days</h3>
    <p>
      The percentage of transfers received that were integrated (filed or
      suppressed) within 8 days of the record being sent.
    </p>
    <h3>Integrated beyond 8 days</h3>
    <p>
      The percentage of transfers received that were integrated (filed or
      suppressed) beyond 8 days of the record being sent.
    </p>
    <p>
      When records are not integrated within 8 days, GP2GP requests that a full
      paper copy is printed and sent to the practice.
    </p>
    <h3>Awaiting integration</h3>
    <p>
      The percentage of transfers received that have not been integrated at the
      point of being categorised (14 days after it started).
    </p>
  </div>
);
