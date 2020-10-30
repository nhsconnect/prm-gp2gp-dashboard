import React from "react";
import isEmpty from "lodash/isEmpty";
import "./index.scss";

const OrganisationDetails = ({ name, odsCode, address }) => (
  <div className="gp2gp-organisation-details">
    <h1 className="nhsuk-heading-l">
      <span className="gp2gp-organisation-details__name">{name}</span>
      <span>{odsCode}</span>
    </h1>
    {!!address && (
      <address data-testid="organisation-details-address">
        {!isEmpty(address.lines) &&
          address.lines.map((line, i) => (
            <span
              className="gp2gp-organisation-details__address-line"
              key={`address-${i}`}
            >
              {line}
            </span>
          ))}
        <span className="gp2gp-organisation-details__address-line">
          {address.town}
        </span>
        <span className="gp2gp-organisation-details__address-line">
          {address.postCode}
        </span>
      </address>
    )}
  </div>
);

export default OrganisationDetails;
