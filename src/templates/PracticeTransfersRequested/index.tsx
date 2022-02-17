import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../components/OrganisationAddress";
import { PracticeMetricsType, PracticeType } from "./practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { ContentsList } from "../../components/common/ContentsList";
import "../index.scss";
import {
  GP2GPTechnicalFailuresDefinition,
  RegistrationsTriggeredByGP2GPDefinition,
  TransfersReceivedPercentageDefinition,
  TransfersRequestedDefinitionsContent,
} from "../../components/Definitions";
import { PageContent } from "../../components/PageContent";
import { generateTransfersRequestedMetricsTableData } from "../../library/utils/generateTransfersRequestedMetricsTableData";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { HelpModal } from "../../components/common/HelpModal";
import { Table } from "../../components/common/Table";

type PageContext = {
  practice: PracticeType;
  layout: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const generateMonthlyRowData = (metrics: PracticeMetricsType[]) => {
  return metrics.map((metric) => {
    const { requestedCount, receivedPercentage, technicalFailuresPercentage } =
      generateTransfersRequestedMetricsTableData(metric.requestedTransfers);

    return [
      `${convertMonthNumberToText(metric.month)} ${metric.year}`,
      requestedCount,
      addPercentageSign(receivedPercentage),
      addPercentageSign(technicalFailuresPercentage),
    ];
  });
};

const PracticeTransfersRequested: FC<PracticeProps> = ({
  pageContext: { practice },
}) => {
  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  const contentListItems = [
    {
      text: "Transfers Requested",
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

      <div className="gp2gp-page-content-wrapper">
        <div className="gp2gp-page-heading">
          <h1 className="nhsuk-u-margin-bottom-5">
            {formattedName ? `${formattedName} - ${odsCode}` : odsCode}
          </h1>
          <OrganisationAddress odsCode={odsCode} />
          <hr aria-hidden={true} />
        </div>

        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <PageContent
          className="gp2gp-page-contents"
          title="GP2GP transfers requested"
          tableDescription={
            <>
              <p>The table below shows the</p>
              <ul>
                <li>number of registrations that triggered a GP2GP transfer</li>
                <li>
                  percentage of GP2GP transfers that were successfully received
                </li>
                <li>
                  percentage of GP2GP transfers that failed for a technical
                  reason
                </li>
              </ul>
            </>
          }
          definitionsContent={<TransfersRequestedDefinitionsContent />}
          expanderTitle="What happens when a GP2GP transfer fails?"
          expanderContent={
            <>
              <p>
                A task will automatically be created for the sending practice to
                send a paper copy of the record to the requesting practice.
              </p>
              <p>
                Technical failures are system related and should be reported to
                the system supplier.
              </p>
            </>
          }
          tableContent={
            <Table
              headers={[
                { title: "Month " },
                {
                  title: "Registrations that triggered GP2GP transfer ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy="triggered-transfers-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <RegistrationsTriggeredByGP2GPDefinition ariaLabelId="triggered-transfers-modal-title" />
                      }
                    />
                  ),
                },
                {
                  title: "GP2GP transfers received ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy="transfers-received-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <TransfersReceivedPercentageDefinition ariaLabelId="transfers-received-modal-title" />
                      }
                    />
                  ),
                },
                {
                  title: (
                    <>
                      GP2GP technical failures{" "}
                      <div className="gp2gp-title-emphasis">
                        (paper copy requested){" "}
                      </div>
                    </>
                  ),
                  extra: (
                    <HelpModal
                      ariaLabelledBy="technical-failures-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <GP2GPTechnicalFailuresDefinition ariaLabelId="technical-failures-modal-title" />
                      }
                    />
                  ),
                },
              ]}
              caption={{
                text: "GP2GP transfers requested",
                hidden: false,
              }}
              rows={generateMonthlyRowData(metrics)}
            />
          }
        />
      </div>
    </>
  );
};

export default PracticeTransfersRequested;
