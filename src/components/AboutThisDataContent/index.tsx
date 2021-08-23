import React from "react";
import "./index.scss";

export const AboutThisDataContent = () => (
  <div className="nhsuk-u-reading-width">
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
  </div>
);
