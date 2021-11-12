import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { OrganisationDetails } from "../../components/OrganisationDetails";
import { PracticeType } from "../Practice/practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { PageContent } from "../../components/PageContent";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { PracticeTableWithSort } from "../../components/PracticeTableWithSort";
import practiceTableContent from "../../data/content/practiceTable.json";
import {
  generateMetricsTableData,
  PracticePercentageType,
} from "../../library/utils/generateMetricsTableData";

import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";
import { HelpModal } from "../../components/common/HelpModal";
import {
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  NotIntegratedWithin8DaysDefinition,
  TransfersReceivedDefinition,
  WhyIntegrateWithin8Days,
} from "../../components/Definitions";

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

  const { showDefinitionsModals } = useFeatureToggles();

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
        <noscript>{`<style>.gp2gp-sort, .gp2gp-tabs, .gp2gp-open-modal {display: none}</style>`}</noscript>
      </Helmet>
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      <PageContent
        title={tableTitle}
        tableDescription={
          <>
            <p>
              The table below shows the integration times for records received
              by the practice.
            </p>
            <p>
              Records that take longer than 24 hours to transfer electronically
              via GP2GP are excluded from the data, even if they are
              successfully integrated. For more information about how the data
              is calculated please see Notes about this data.
            </p>
          </>
        }
        tableContent={
          <PracticeTableWithSort
            ccgPractices={ccgPracticeTableData}
            headers={
              showDefinitionsModals
                ? [
                    { title: "Requesting practice name " },
                    {
                      title: "Transfers received ",
                      extra: (
                        <HelpModal
                          ariaLabelledBy="transfers-received-modal-title"
                          iconHiddenDescription="Open modal with definition"
                          content={
                            <TransfersReceivedDefinition ariaLabelId="transfers-received-modal-title" />
                          }
                        />
                      ),
                    },
                    {
                      title: "Integrated within 3 days ",
                      extra: (
                        <HelpModal
                          ariaLabelledBy="integrated-within-3-days-modal-title"
                          iconHiddenDescription="Open modal with definition"
                          content={
                            <IntegratedWithin3DaysDefinition ariaLabelId="integrated-within-3-days-modal-title" />
                          }
                        />
                      ),
                    },
                    {
                      title: "Integrated within 8 days ",
                      extra: (
                        <HelpModal
                          ariaLabelledBy="integrated-within-8-days-modal-title"
                          iconHiddenDescription="Open modal with definition"
                          content={
                            <IntegratedWithin8DaysDefinition ariaLabelId="integrated-within-8-days-modal-title" />
                          }
                        />
                      ),
                    },
                    {
                      title: (
                        <>
                          Not integrated within 8 days{" "}
                          <div className="gp2gp-title-emphasis">
                            (paper copy sent){" "}
                          </div>
                        </>
                      ),
                      extra: (
                        <HelpModal
                          ariaLabelledBy="not-integrated-within-8-days-modal-title"
                          iconHiddenDescription="Open modal with definition"
                          content={
                            <>
                              <NotIntegratedWithin8DaysDefinition ariaLabelId="not-integrated-within-8-days-modal-title" />
                              <WhyIntegrateWithin8Days title="Why integrate within 8 days?" />
                            </>
                          }
                        />
                      ),
                    },
                  ]
                : [
                    { title: "Requesting practice name " },
                    { title: "Transfers received " },
                    { title: "Integrated within 3 days " },
                    { title: "Integrated within 8 days " },
                    {
                      title: (
                        <>
                          Not integrated within 8 days{" "}
                          <div className="gp2gp-title-emphasis">
                            (paper copy sent){" "}
                          </div>
                        </>
                      ),
                    },
                  ]
            }
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
