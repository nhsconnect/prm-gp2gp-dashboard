import React from "react";
import "./index.scss";

const PracticeDetails = ({ name, ODSCode, address }) => (
  <div className="gp2gp-practice-details">
    <h1 className="nhsuk-heading-l">
      {name} | {ODSCode}
    </h1>
    <address>
      {address.lines.map((line, i) => (
        <span
          className="gp2gp-practice-details__address-line"
          key={`address-${i}`}
        >
          {line}
        </span>
      ))}
      <span className="gp2gp-practice-details__address-line">
        {address.town}
      </span>
      <span className="gp2gp-practice-details__address-line">
        {address.postCode}
      </span>
    </address>
  </div>
);

export default PracticeDetails;
