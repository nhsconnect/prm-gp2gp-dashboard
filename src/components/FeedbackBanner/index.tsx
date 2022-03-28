import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

type FeedbackBannerProps = {
  className?: string;
};

export const FeedbackBanner: FC<FeedbackBannerProps> = ({ className }) => (
  <aside className={classNames("nhsuk-inset-text", className)}>
    <h3>Feedback</h3>
    <p>
      We are always looking to improve our site.{" "}
      <a href="https://qfreeaccountssjc1.az1.qualtrics.com/jfe/form/SV_ac1GS7jmHNtMTlA">
        Take our survey
      </a>{" "}
      to let us know what you think.
    </p>
  </aside>
);
