import React from "react";
import "./index.scss";

const PracticeDetails = ({ name, ODSCode, address }) => (
  <div className="nhsuk-practice-details">
    <h1 className="nhsuk-heading-l">
      {name} | {ODSCode}
    </h1>
    <address>
      {address.lines.map((line, i) => (
        <span
          className="nhsuk-practice-details__address-line"
          key={`address-${i}`}
        >
          {line}
        </span>
      ))}
      <span className="nhsuk-practice-details__address-line">
        {address.town}
      </span>
      <span className="nhsuk-practice-details__address-line">
        {address.postCode}
      </span>
    </address>
  </div>
);

export default PracticeDetails;
