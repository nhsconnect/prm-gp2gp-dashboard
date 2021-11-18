import React from "react";
import "./index.scss";

export const AboutThisDataContent = () => (
  <div className="nhsuk-u-reading-width">
    <h3 className="nhsuk-u-margin-top-6">How we calculate the data</h3>
    <ul>
      <li>
        This site is updated 14 days after the end of each month. This is to
        identify whether transfers started at the end of the month were
        integrated within 8 days. When records are not integrated within 8 days,
        GP2GP requests that a full paper copy is printed and sent to the
        practice.
      </li>
      <li>
        Every transfer shown on the platform is categorised 14 days after it
        started. For example, a transfer started on the 2nd February would be
        categorised based on its status on the 16th February.
      </li>
      <li>
        The time to integrate is calculated from the time the record starts to
        transfer via GP2GP to the time it was integrated at the new practice.
      </li>
      <li>
        Records that take longer than 24 hours to transfer electronically via
        GP2GP to the new practice are excluded from the data, even if they are
        successfully integrated.
      </li>
      <li>
        There are a small number of scenarios that mean the data might be
        slightly different from what you expect.
      </li>
    </ul>
    <p>
      If you have any concerns about the data for a specific practice please
      contact us at{" "}
      <a href="mailto:gp-registrations-data@nhs.net">
        gp-registrations-data@nhs.net
      </a>
      .
    </p>

    <h3>What you can find out</h3>
    <ul>
      <li>
        The number of records that were transferred via GP2GP and were
        successfully received by the practice (excluding those where the
        electronic transfer took longer than 24 hours).
      </li>
      <li>The time it took for received transfers to be integrated.</li>
      <li>
        The proportion of received transfers that were not integrated within 8
        days. These trigger a paper copy being printed and sent.
      </li>
    </ul>
    <h3>What this data can’t tell you</h3>
    <ul>
      <li>
        Integration times for records that took longer than 24 hours to transfer
        via GP2GP
      </li>
      <li>Information about transfers out of the practice</li>
      <li>Information about failed transfers</li>
    </ul>
  </div>
);
