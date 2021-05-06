import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationDetails } from "../../components/OrganisationDetails";
import { Table } from "../../components/common/Table";
import { AboutThisDataContent } from "../../components/AboutThisDataContent";
import { Expander } from "../../components/common/Expander";

import { IntegratedPracticeMetricsType, PracticeType } from "./practice.types";

import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { useApi } from "../../library/hooks/useApi";

import eightDayExpanderContent from "../../data/content/eightDayExpander.json";
import slaMetricsContent from "../../data/content/practiceMetrics.json";
import "./index.scss";

type PageContext = {
  practice: PracticeType;
  layout: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const generateRowData = (integratedMetrics: IntegratedPracticeMetricsType) => {
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
        rows={generateRowData(requester.integrated)}
      />
      <AboutThisDataContent />
    </>
  );
};

export default Practice;
