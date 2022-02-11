import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../components/OrganisationAddress";
import { Table } from "../../components/common/Table";

import { PracticeMetricsType, PracticeType } from "./practice.types";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { PageContent } from "../../components/PageContent";
import { generateMetricsTableData } from "../../library/utils/generateMetricsTableData";
import { HelpModal } from "../../components/common/HelpModal";
import {
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  NotIntegratedWithin8DaysDefinition,
  TransfersReceivedDefinition,
  WhyIntegrateWithin8Days,
} from "../../components/Definitions";
import "../index.scss";
import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";
import { ContentsList } from "../../components/common/ContentsList";

type PageContext = {
  practice: PracticeType;
  layout: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const generateMonthlyRowData = (metrics: PracticeMetricsType[]) => {
  return metrics.map((metric) => {
    const {
      receivedCount,
      integratedWithin3DaysPercentage,
      integratedWithin8DaysPercentage,
      notIntegratedWithin8DaysPercentage,
    } = generateMetricsTableData(metric.requestedTransfers);

    return [
      `${convertMonthNumberToText(metric.month)} ${metric.year}`,
      receivedCount,
      addPercentageSign(integratedWithin3DaysPercentage),
      addPercentageSign(integratedWithin8DaysPercentage),
      addPercentageSign(notIntegratedWithin8DaysPercentage),
    ];
  });
};

const PracticeIntegrationTimes: FC<PracticeProps> = ({
  pageContext: { practice },
}) => {
  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  const { showContentsNavigation } = useFeatureToggles();

  const contentListItems = [
    {
      text: "Integration times",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for this practice"
        />
        <noscript>{`<style>.gp2gp-tabs,.gp2gp-open-modal-btn {display: none}</style>`}</noscript>
      </Helmet>
      {showContentsNavigation ? (
        <div className="gp2gp-page-content-wrapper">
          <div className="gp2gp-page-heading">
            <h1 className="nhsuk-u-margin-bottom-5">
              {formattedName ? `${formattedName} - ${odsCode}` : odsCode}
            </h1>
            <OrganisationAddress odsCode={odsCode} />
            <hr aria-hidden={true} />
          </div>

          <aside className="gp2gp-page-aside">
            <ContentsList items={contentListItems} />
          </aside>
          <PageContent
            className="gp2gp-page-contents"
            title="Integration times"
            tableDescription={
              <>
                <p>
                  The table below shows the integration times for records
                  received by the practice.
                </p>
                <p>
                  Records that take longer than 24 hours to transfer
                  electronically via GP2GP are excluded from the data, even if
                  they are successfully integrated. For more information about
                  how the data is calculated please see the 'Notes about this
                  data' section.
                </p>
              </>
            }
            tableContent={
              <Table
                headers={[
                  { title: "Month " },
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
                ]}
                caption={{
                  text: "Integration times for the recent months",
                  hidden: true,
                }}
                rows={generateMonthlyRowData(metrics)}
              />
            }
          />
        </div>
      ) : (
        <>
          <h1 className="nhsuk-u-margin-bottom-5">
            {formattedName ? `${formattedName} - ${odsCode}` : odsCode}
          </h1>
          <OrganisationAddress odsCode={odsCode} />
          <hr aria-hidden={true} />

          <PageContent
            title="Integration times"
            tableDescription={
              <>
                <p>
                  The table below shows the integration times for records
                  received by the practice.
                </p>
                <p>
                  Records that take longer than 24 hours to transfer
                  electronically via GP2GP are excluded from the data, even if
                  they are successfully integrated. For more information about
                  how the data is calculated please see the 'Notes about this
                  data' section.
                </p>
              </>
            }
            tableContent={
              <Table
                headers={[
                  { title: "Month " },
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
                ]}
                caption={{
                  text: "Integration times for the recent months",
                  hidden: true,
                }}
                rows={generateMonthlyRowData(metrics)}
              />
            }
          />
        </>
      )}
    </>
  );
};

export default PracticeIntegrationTimes;