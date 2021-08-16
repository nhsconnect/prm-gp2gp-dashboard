import React from "react";
import "./index.scss";

export const AboutThisDataContent = () => (
  <div className="nhsuk-u-reading-width">
    <h2 id="about-this-data" className="nhsuk-u-margin-top-6">
      About this data
    </h2>
    <p>
      The Data Platform is updated 14 days after the end of the month. This is
      so we can identify whether transfers started at the end of the month were
      integrated within 8 days. When records are not integrated within 8 days,
      GP2GP requests that a full paper copy is printed and sent to the practice.
    </p>
    <p>
      Every transfer shown on the platform is categorised 14 days after it
      started. For example, for a transfer initiated on the 2nd February, we
      would categorise that transfer based on its state on the 15th February.
    </p>
    <p>
      If a transfer is integrated more than 14 days after it started, it will
      not be shown in these integration metrics. This is because it was still
      awaiting integration when it was categorised.
    </p>
    <h3>Total integrations</h3>
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
