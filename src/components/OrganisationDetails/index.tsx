import React, { FC } from "react";
import isEmpty from "lodash/isEmpty";
import "./index.scss";

type Address = {
  lines?: string[];
  postCode: string;
  town: string;
};

type OrganisationDetailsProps = {
  odsCode: string;
  name: string;
  address?: Address;
};

export const OrganisationDetails: FC<OrganisationDetailsProps> = ({
  name,
  odsCode,
  address,
}) => (
  <div className="gp2gp-organisation-details">
    <h1 className="nhsuk-u-margin-bottom-5">
      {name ? `${name} - ${odsCode}` : odsCode}
    </h1>
    {!!address && (
      <address data-testid="organisation-details-address">
        {!isEmpty(address.lines) &&
          address.lines!.map((line, i) => (
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
