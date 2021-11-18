import React, { FC } from "react";
import "./index.scss";

export const FeedbackBanner: FC = () => (
  <aside className="nhsuk-inset-text">
    <h3>Get in touch</h3>
    <p>
      We are always looking to improve our site.{" "}
      <a href="https://qfreeaccountssjc1.az1.qualtrics.com/jfe/form/SV_ac1GS7jmHNtMTlA">
        Take our survey
      </a>{" "}
      to let us know what you think. If you need help with GP Registrations
      Data, or if it isn't working properly, contact the team at{" "}
      <a href="mailto:gp-registrations-data@nhs.net">
        gp-registrations-data@nhs.net
      </a>
    </p>
  </aside>
);
