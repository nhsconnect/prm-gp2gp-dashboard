import React, { Fragment } from "react";
import PracticeDetails from "../components/PracticeDetails";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../library/api/ODSPortal";
import {
  convertMonthNumberToText,
  convertToTitleCase,
} from "../library/common/index";
import SlaMetrics from "../components/SlaMetrics";
import { useApi } from "../library/hooks";

const Practice = ({ pageContext }) => {
  const [isLoading, apiData, apiErr] = useApi(
    `${ODS_PORTAL_URL}/${pageContext.odsCode}`
  );

  const { name, odsCode, month, year, metrics } = pageContext;
  const formattedName = convertToTitleCase(name);
  const monthName = convertMonthNumberToText(month);

  return (
    <Fragment>
      {isLoading | apiErr ? (
        <PracticeDetails name={formattedName} odsCode={odsCode} />
      ) : (
        <PracticeDetails
          name={formattedName}
          odsCode={odsCode}
          address={transformPracticeAddress(
            apiData.Organisation.GeoLoc.Location
          )}
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
