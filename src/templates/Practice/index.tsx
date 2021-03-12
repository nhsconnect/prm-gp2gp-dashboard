import React, { FC } from "react";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../../components/OrganisationDetails";
import Table from "../../components/Table";
import { AboutThisDataContent } from "../../components/AboutThisDataContent";
import { Expander } from "../../components/Expander";

import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import { useApi } from "../../library/hooks/useApi";

import eightDayExpanderContent from "../../data/content/eightDayExpander.json";
import slaMetricsContent from "../../data/content/practiceMetrics.json";
import "./index.scss";

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
  year: number;
  month: number;
  requester: {
    integrated: IntegratedPracticeMetrics;
  };
};

export type Practice = {
  odsCode: string;
  name: string;
  metrics: PracticeMetrics[];
};

type PageContext = {
  practice: Practice;
  layout: string;
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

const Practice: FC<PracticeProps> = ({ pageContext: { practice } }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${practice.odsCode}`
  );

  const isIntegratedPercentageOn = useFeatureToggle(
    "F_PRACTICE_SLA_PERCENTAGE"
  );

  const {
    name,
    odsCode,
    metrics: [{ month, year, requester }],
  } = practice;
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

      <Expander
        title={eightDayExpanderContent.title}
        content={
          <>
            <p>{eightDayExpanderContent.firstParagraph}</p>
            <p>{eightDayExpanderContent.secondParagraph}</p>
          </>
        }
      />
      <Table
        className={"gp2gp-practice-table"}
        headers={slaMetricsContent.tableHeaders}
        captionText={tableCaptionText}
        rows={
          isIntegratedPercentageOn
            ? _generate_row_data(requester.integrated)
            : [
                [
                  requester.integrated.transferCount.toString(),
                  requester.integrated.within3Days.toString(),
                  requester.integrated.within8Days.toString(),
                  requester.integrated.beyond8Days.toString(),
                ],
              ]
        }
      />
      <AboutThisDataContent />
    </>
  );
};

export default Practice;
