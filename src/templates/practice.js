import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../components/OrganisationDetails";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../library/api/ODSPortal";
import { convertToTitleCase } from "../library/utils/convertToTitleCase/index";
import { convertMonthNumberToText } from "../library/utils/convertMonthNumberToText/index";
import SlaMetrics from "../components/SlaMetrics";
import { useApi } from "../library/hooks/useApi";
import { useFeatureToggle } from "../library/hooks/useFeatureToggle";
import Table from "../components/Table";
import slaMetricsContent from "../data/content/slaMetrics.json";

const Practice = ({ pageContext }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${pageContext.odsCode}`
  );
  const isPracticeIntegratedTransferCountOn = useFeatureToggle(
    "F_PRACTICE_INTEGRATED_TRANSFER_COUNT"
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
      {isPracticeIntegratedTransferCountOn ? (
        <Table
          headers={slaMetricsContent.tableHeaders}
          rows={[
            [
              metrics.transferCount,
              metrics.within3Days,
              metrics.within8Days,
              metrics.beyond8Days,
            ],
          ]}
        />
      ) : (
        <SlaMetrics metrics={metrics} />
      )}
    </Fragment>
  );
};

export default Practice;
