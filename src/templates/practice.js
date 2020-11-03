import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../components/OrganisationDetails";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../library/api/ODSPortal";
import {
  convertMonthNumberToText,
  convertToTitleCase,
} from "../library/common/index";
import SlaMetrics from "../components/SlaMetrics";
import { useApi } from "../library/hooks/useApi";

const Practice = ({ pageContext }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${pageContext.odsCode}`
  );

  const { name, odsCode, month, year, metrics } = pageContext;
  const formattedName = convertToTitleCase(name);
  const monthName = convertMonthNumberToText(month);

  return (
    <Fragment>
      <Helmet title={`${formattedName} | ${odsCode}`} />
      {isLoading | error ? (
        <OrganisationDetails name={formattedName} odsCode={odsCode} />
      ) : (
        <OrganisationDetails
          name={formattedName}
          odsCode={odsCode}
          address={transformPracticeAddress(data.Organisation.GeoLoc.Location)}
        />
      )}
      <hr />
      <h2 className="nhsuk-heading-m">
        {monthName} {year}
      </h2>
      <SlaMetrics metrics={metrics} />
    </Fragment>
  );
};

export default Practice;
