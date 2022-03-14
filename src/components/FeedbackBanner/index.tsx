import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

type FeedbackBannerProps = {
  className?: string;
};
const personalInfoNote = encodeURIComponent(
  "Please note we are unable to assist with individual patient or practice queries. Please do not send any personal information to this email address."
);

export const FeedbackBanner: FC<FeedbackBannerProps> = ({ className }) => (
  <aside className={classNames("nhsuk-inset-text", className)}>
    <h3>Get in touch</h3>
    <p>
      We are always looking to improve our site.{" "}
      <a href="https://qfreeaccountssjc1.az1.qualtrics.com/jfe/form/SV_ac1GS7jmHNtMTlA">
        Take our survey
      </a>{" "}
      to let us know what you think.
    </p>
    <p>
      If you need help with this site, or if it isn't working properly, contact
      the team at{" "}
      <a href={`mailto:gp-registrations-data@nhs.net?body=${personalInfoNote}`}>
        gp-registrations-data@nhs.net
      </a>
      . <strong>{personalInfoNote}</strong>
    </p>
  </aside>
);
