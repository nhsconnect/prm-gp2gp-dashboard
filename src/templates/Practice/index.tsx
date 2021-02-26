import React, { FC } from "react";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../../components/OrganisationDetails";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import SlaMetrics from "../../components/SlaMetrics";
import { useApi } from "../../library/hooks/useApi";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import Table from "../../components/Table";
import slaMetricsContent from "../../data/content/slaMetrics.json";
import "./index.scss";

type IntegratedPracticeMetricsProps = {
  transferCount: number;
  within3Days: number;
  within8Days: number;
  beyond8Days: number;
};

type IntegratedPracticeMetrics = {
  integrated: IntegratedPracticeMetricsProps;
};

// TODO: Remove as part of PRMT-1366 cleanup
type SlaMetricsPropsDeprecated = {
  within3Days: number;
  within8Days: number;
  beyond8Days: number;
};

// TODO: Remove as part of PRMT-1366 cleanup
type SlaMetricsDeprecated = {
  timeToIntegrateSla: SlaMetricsPropsDeprecated;
};

type PageContext = {
  odsCode: string;
  name: string;
  year: number;
  month: number;
  // TODO: Remove as part of PRMT-1366 cleanup
  metrics: IntegratedPracticeMetrics | SlaMetricsDeprecated;
};

type PracticeProps = {
  pageContext: PageContext;
};

const Practice: FC<PracticeProps> = ({ pageContext }) => {
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
    <>
      <Helmet title={`${formattedName} | ${odsCode}`} />
      {isLoading || error ? (
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
          className={"gp2gp-practice-table"}
          headers={slaMetricsContent.tableHeaders}
          rows={[
            [
              // TODO: Remove as part of PRMT-1366 cleanup
              // @ts-ignore
              metrics.integrated.transferCount.toString(),
              // @ts-ignore
              metrics.integrated.within3Days.toString(),
              // @ts-ignore
              metrics.integrated.within8Days.toString(),
              // @ts-ignore
              metrics.integrated.beyond8Days.toString(),
            ],
          ]}
        />
      ) : (
        // @ts-ignore
        <SlaMetrics metrics={metrics.timeToIntegrateSla} />
      )}
    </>
  );
};

export default Practice;
