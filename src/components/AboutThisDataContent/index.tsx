import React from "react";
import "./index.scss";

export const AboutThisDataContent = () => (
  <div className="nhsuk-u-reading-width">
    <h3 className="nhsuk-u-margin-top-6">How we calculate the data</h3>
    <ul className="gp2gp-list-with-hidden-sublist-items">
      <li>
        This site is updated 14 days after the end of each month. This is to
        identify whether transfers started at the end of the month were
        integrated within 8 days.
      </li>
      <li>
        Every transfer shown on the platform is categorised 14 days after it
        started.
        <ul>
          <li>
            <i>
              For example, a transfer started on the 2nd February would be
              categorised based on its status on the 16th February.
            </i>
          </li>
        </ul>
      </li>
      <li>
        The time to integrate is calculated from the time the GP2GP transfer
        starts to the time the record is integrated by the registering practice.
        <ul>
          <li>
            <i>
              For example, the GP2GP transfer for a record takes 10 minutes. The
              practice integrates the record 2 hours after receiving it. The
              time to integrate would be 2 hours 10 minutes (within 3 days).
            </i>
          </li>
        </ul>
      </li>
      <li>
        In a small number of cases the data may be different to what is expected
        because the GP2GP transfer took longer to complete. If the GP2GP
        transfer takes longer, the practice has less time to integrate before
        the paper process is triggered on day 8.
        <ul>
          <li>
            <i>
              For example, if the GP2GP transfer takes 3 days, the practice has
              5 days to integrate before the paper process is triggered.
            </i>
          </li>
        </ul>
      </li>
      <li>
        There may be other scenarios which mean the data is different from what
        is expected. If you have concerns about the data for a specific
        practice, please contact us at{" "}
        <a href="mailto:gp-registrations-data@nhs.net">
          gp-registrations-data@nhs.net
        </a>
        .
      </li>
    </ul>

    <h3>Not included in the data</h3>
    <p>The following are not included in the data on this site.</p>
    <ul>
      <li>GP2GP transfers for deducting practices</li>
      <li>
        registrations that are not eligible for GP2GP. For example:
        <ul>
          <li>the previous practice was in Wales or Scotland</li>
          <li>registrations to and from the armed forces or justice system</li>
          <li>there is no previous practice registered, for any reason</li>
        </ul>
      </li>
      <li>
        registrations that had a technical issue before GP2GP was triggered
      </li>
      <li>transfers between SystmOne practices that do not go via GP2GP</li>
    </ul>
  </div>
);
