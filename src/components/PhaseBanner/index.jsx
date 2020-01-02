import React from "react";
import "./index.scss";

const PhaseBanner = ({ tag, children }) => (
  <div className="nhsuk-phase-banner">
    <p className="nhsuk-phase-banner__text">
      <strong className="nhsuk-phase-banner__tag">{tag}</strong>
      {children}
    </p>
  </div>
);

export default PhaseBanner;
