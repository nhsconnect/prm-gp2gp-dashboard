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
      integrated within the 8 day SLA.
    </p>
    <p>
      Transfers that are pending integration when the Data Platform is updated
      are not included, even if they are integrated at a later date.
    </p>
    <p>
      For example, a practice receives a record via GP2GP within the month of
      May. They integrated this record on the 28th June, which is more than 14
      days after the end of the month. This integration will not be included in
      this data.
    </p>
    <h3>Total integrations</h3>
    <p>All GP2GP transfers that were:</p>
    <ul>
      <li>
        requested by the practice between the 1st and last day of the month, and
      </li>
      <li>
        integrated (filed or suppressed) by the receiving practice by the update
        date
      </li>
    </ul>
    <p>It does not include GP2GP transfers that:</p>
    <ul>
      <li>failed to transfer, or</li>
      <li>were rejected by the receiving practice, or</li>
      <li>are pending integration when the Data Platform is updated</li>
    </ul>
    <h3>Within 3 days</h3>
    <p>
      The percentage of the total integrations that were integrated (filed or
      suppressed) within 3 days of the practice receiving the record.
    </p>
    <p>
      3 days is considered best practice for integrating or suppressing records
      transferred via GP2GP.
    </p>
    <h3>Within 8 days</h3>
    <p>
      The percentage of the total integrations that were integrated (filed or
      suppressed) within 8 days of the practice receiving the record.
    </p>
    <h3>Beyond 8 days</h3>
    <p>
      The percentage of the total integrations that were integrated (filed or
      suppressed) beyond 8 days of the practice receiving the record.
    </p>
    <p>
      When records are not integrated within 8 days, GP2GP requests that a full
      paper copy is printed and sent to the practice.
    </p>
  </div>
);
