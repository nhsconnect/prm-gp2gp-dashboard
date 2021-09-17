import React from "react";
import "./index.scss";

export const AboutThisDataContent = () => (
  <div className="nhsuk-u-reading-width">
    <h2 className="nhsuk-u-margin-top-6">About this data</h2>
    <p>
      This site is updated 14 days after the end of each month. This is to
      identify whether transfers started at the end of the month were integrated
      within 8 days. When records are not integrated within 8 days, GP2GP
      requests that a full paper copy is printed and sent to the practice.
    </p>
    <p>
      Every transfer shown on the platform is categorised 14 days after it
      started. For example, a transfer started on the 2nd February would be
      categorised based on its status on the 15th February.
    </p>
    <h3>What you can find out</h3>
    <ul>
      <li>
        The number of GP2GP transfers successfully received by the practice
      </li>
      <li>The time it took for the records to be integrated by the practice</li>
      <li>
        The proportion of received transfers that were not integrated within 8
        days. These trigger a paper copy being printed and sent.
      </li>
    </ul>
    <h3>What this data can’t tell you</h3>
    <ul>
      <li>Information about transfers out of the practice</li>
      <li>Information about failed transfers</li>
    </ul>
  </div>
);
