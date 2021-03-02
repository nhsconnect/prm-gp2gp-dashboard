import React, { FC } from "react";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../../components/OrganisationDetails";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { useApi } from "../../library/hooks/useApi";
import Table from "../../components/Table";
import slaMetricsContent from "../../data/content/practiceMetrics.json";
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

type PageContext = {
  odsCode: string;
  name: string;
  year: number;
  month: number;
  metrics: IntegratedPracticeMetrics;
};

type PracticeProps = {
  pageContext: PageContext;
};

const Practice: FC<PracticeProps> = ({ pageContext }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${pageContext.odsCode}`
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
      <Table
        className={"gp2gp-practice-table"}
        headers={slaMetricsContent.tableHeaders}
        rows={[
          [
            metrics.integrated.transferCount.toString(),
            metrics.integrated.within3Days.toString(),
            metrics.integrated.within8Days.toString(),
            metrics.integrated.beyond8Days.toString(),
          ],
        ]}
      />
    </>
  );
};

export default Practice;
