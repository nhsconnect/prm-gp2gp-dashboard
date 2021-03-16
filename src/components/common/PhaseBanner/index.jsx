import React from "react";
import "./index.scss";

export const PhaseBanner = ({ tag, children }) => (
  <div className="gp2gp-phase-banner">
    <p className="nhsuk-body-s nhsuk-u-margin-bottom-0">
      <strong className="nhsuk-u-margin-right-3 gp2gp-phase-banner__tag">
        {tag}
      </strong>
      {children}
    </p>
  </div>
);
