import React, { FC } from "react";
import isEmpty from "lodash/isEmpty";
import "./index.scss";

type OrganisationDetailsProps = {
  address: {
    lines?: string[];
    postCode: string;
    town: string;
  };
};

export const OrganisationAddress: FC<OrganisationDetailsProps> = ({
  address,
}) => (
  <address
    data-testid="organisation-details-address"
    className="gp2gp-organisation-address"
  >
    {!isEmpty(address.lines) &&
      address.lines!.map((line, i) => (
        <span
          className="gp2gp-organisation-address__address-line"
          key={`address-${i}`}
        >
          {line}
        </span>
      ))}
    <span className="gp2gp-organisation-address__address-line">
      {address.town}
    </span>
    <span className="gp2gp-organisation-address__address-line">
      {address.postCode}
    </span>
  </address>
);
