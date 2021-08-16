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
    <h4>Why might there be fewer successful integrations than I expect?</h4>
    <p>
      Every transfer shown on the site is categorised 14 days after it started.
      Currently, transfers that are not integrated within 14 days are not
      included.
    </p>
    <p>
      For example, a transfer started on the 2nd February and not integrated by
      the 15th February would not be included in the successful integration
      number.
    </p>
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
