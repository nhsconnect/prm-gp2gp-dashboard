import React, { FC } from "react";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../../components/OrganisationDetails";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { useApi } from "../../library/hooks/useApi";
import Table from "../../components/Table";
import slaMetricsContent from "../../data/content/practiceMetrics.json";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";

import "./index.scss";
import { AboutThisDataContent } from "../../components/AboutThisDataContent";

type IntegratedPracticeMetrics = {
  transferCount: number;
  within3DaysPercentage: number | null;
  within8DaysPercentage: number | null;
  beyond8DaysPercentage: number | null;
  within3Days: number;
  within8Days: number;
  beyond8Days: number;
};

type PracticeMetrics = {
  integrated: IntegratedPracticeMetrics;
};

type PageContext = {
  odsCode: string;
  name: string;
  year: number;
  month: number;
  metrics: PracticeMetrics;
};

type PracticeProps = {
  pageContext: PageContext;
};

const _generate_row_data = (integratedMetrics: IntegratedPracticeMetrics) => {
  return [
    [
      integratedMetrics.transferCount.toString(),
      addPercentageSign(integratedMetrics.within3DaysPercentage),
      addPercentageSign(integratedMetrics.within8DaysPercentage),
      addPercentageSign(integratedMetrics.beyond8DaysPercentage),
    ],
  ];
};

const Practice: FC<PracticeProps> = ({ pageContext }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${pageContext.odsCode}`
  );

  const isIntegratedPercentageOn = useFeatureToggle(
    "F_PRACTICE_SLA_PERCENTAGE"
  );

  const { name, odsCode, month, year, metrics } = pageContext;
  const formattedName = convertToTitleCase(name);

  const tableCaptionText = `Practice performance for ${convertMonthNumberToText(
    month
  )} ${year}`;

  return (
    <>
      <Helmet
        title={`${formattedName} | ${odsCode} - GP Registrations Data Platform`}
      />
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

      <p className="nhsuk-body">
        The table below shows the time to integrate for records received by the
        practice. More information{" "}
        <a href={"#about-this-data"}>about this data</a>.
      </p>

      <Table
        className={"gp2gp-practice-table"}
        headers={slaMetricsContent.tableHeaders}
        captionText={tableCaptionText}
        rows={
          isIntegratedPercentageOn
            ? _generate_row_data(metrics.integrated)
            : [
                [
                  metrics.integrated.transferCount.toString(),
                  metrics.integrated.within3Days.toString(),
                  metrics.integrated.within8Days.toString(),
                  metrics.integrated.beyond8Days.toString(),
                ],
              ]
        }
      />
      <AboutThisDataContent />
    </>
  );
};

export default Practice;
