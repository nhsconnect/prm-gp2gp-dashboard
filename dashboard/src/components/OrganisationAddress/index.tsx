import React, { FC } from "react";
import isEmpty from "lodash/isEmpty";
import "./index.scss";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { useApi } from "../../library/hooks/useApi";

type AddressType = {
  lines?: string[];
  postCode: string;
  town: string;
};

type OrganisationAddressProps = {
  odsCode: string;
};

export const OrganisationAddress: FC<OrganisationAddressProps> = ({
  odsCode,
}) => {
  const { isLoading, data, error } = useApi(`${ODS_PORTAL_URL}/${odsCode}`);

  if (isLoading || error) return null;

  const address: AddressType = transformPracticeAddress(
    data.Organisation.GeoLoc.Location
  );
  return (
    <address
      data-testid="organisation-address"
      className="gp2gp-organisation-address"
    >
      {!isEmpty(address.lines) &&
        address.lines!.map((line, i) => {
          return (
            line && (
              <span
                className="gp2gp-organisation-address__address-line"
                key={`address-${i}`}
              >
                {line}
              </span>
            )
          );
        })}
      <span className="gp2gp-organisation-address__address-line">
        {address.town}
      </span>
      <span className="gp2gp-organisation-address__address-line">
        {address.postCode}
      </span>
    </address>
  );
};
