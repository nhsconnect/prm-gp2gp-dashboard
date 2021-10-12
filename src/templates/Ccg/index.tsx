import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { OrganisationDetails } from "../../components/OrganisationDetails";
import { PracticeType } from "../Practice/practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { PageContent } from "../../components/PageContent";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { PracticeTableWithSort } from "../../components/PracticeTableWithSort";
import practiceTableContent from "../../data/content/practiceTable.json";
import ccgContent from "../../data/content/ccg.json";
import {
  generateMetricsTableData,
  PracticePercentageType,
} from "../../library/utils/generateMetricsTableData";

type PageContext = {
  odsCode: string;
  name: string;
  ccgPractices: PracticeType[];
};

type CcgProps = {
  pageContext: PageContext;
};

const Ccg: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, ccgPractices } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const { year, month } = ccgPractices[0].metrics[0];
  const tableTitle = `Integration times for ${convertMonthNumberToText(
    month
  )} ${year}`;

  const ccgPracticeTableData: PracticePercentageType[] = ccgPractices.map(
    (practice) => ({
      odsCode: practice.odsCode,
      name: practice.name,
      metrics: [
        {
          year: practice.metrics[0].year,
          month: practice.metrics[0].month,
          requestedTransfers: generateMetricsTableData(
            practice.metrics[0].requestedTransfers
          ),
        },
      ],
    })
  );

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-sort, .gp2gp-tabs {display: none}</style>`}</noscript>
      </Helmet>
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      <PageContent
        title={tableTitle}
        tableDescription={ccgContent.tableDescription}
        tableContent={
          <PracticeTableWithSort
            ccgPractices={ccgPracticeTableData}
            headers={[
              { title: "Requesting practice name " },
              { title: "Transfers received " },
              { title: "Integrated within 3 days " },
              { title: "Integrated within 8 days " },
              {
                title: "Not integrated within 8 days ",
                extra: (
                  <div className="gp2gp-title-emphasis">(paper copy sent) </div>
                ),
              },
            ]}
            sortBySelect={practiceTableContent.sortBySelect}
            orderSelect={practiceTableContent.orderSelect}
            tableCaption={tableTitle}
          />
        }
      />
    </>
  );
};
export default Ccg;
