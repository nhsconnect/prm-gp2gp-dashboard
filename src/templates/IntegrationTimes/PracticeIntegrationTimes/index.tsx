import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../../components/OrganisationAddress";
import { Table } from "../../../components/common/Table";

import {
  PracticeMetricsType,
  PracticeType,
} from "../../../library/types/practice.types";

import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../../library/utils/addPercentageSign";
import { PageContent } from "../../../components/PageContent";
import { HelpModal } from "../../../components/common/HelpModal";
import {
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  IntegrationsDefinitionsContent,
  NotIntegratedWithin8DaysDefinition,
  TransfersReceivedDefinition,
  WhyIntegrateWithin8Days,
} from "../../../components/Definitions";
import "../../index.scss";
import { ContentsList } from "../../../components/common/ContentsList";

type PageContext = {
  practice: PracticeType;
  layout: string;
  dataUpdatedDate: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const generateMonthlyRowData = (metrics: PracticeMetricsType[]) => {
  return metrics.map((metric) => {
    const {
      receivedCount,
      integratedWithin3DaysPercentOfReceived,
      integratedWithin8DaysPercentOfReceived,
      notIntegratedWithin8DaysPercentOfReceived,
    } = metric.requestedTransfers;

    return [
      `${convertMonthNumberToText(metric.month)} ${metric.year}`,
      receivedCount,
      addPercentageSign(integratedWithin3DaysPercentOfReceived),
      addPercentageSign(integratedWithin8DaysPercentOfReceived),
      addPercentageSign(notIntegratedWithin8DaysPercentOfReceived),
    ];
  });
};

const PracticeIntegrationTimes: FC<PracticeProps> = ({ pageContext }) => {
  const { dataUpdatedDate, practice } = pageContext;
  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  const contentListItems = [
    {
      text: "Integration times",
    },
    {
      text: "GP2GP transfers requested",
      href: `/practice/${odsCode}/gp2gp-transfers-requested`,
    },
    {
      text: "Download data",
      href: `/practice/${odsCode}/download-data`,
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
            <span className="nhsuk-u-visually-hidden"> integration times</span>
          </h1>
          <OrganisationAddress odsCode={odsCode} />
          <hr aria-hidden={true} />
        </div>

        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <PageContent
          className="gp2gp-page-contents"
          title="Integration times for registering practice"
          tableDescription={
            <p>
              The table below shows the integration times for GP2GP transfers
              received.
            </p>
          }
          expanderTitle="Why integrate within 8 days"
          expanderContent={<WhyIntegrateWithin8Days />}
          definitionsContent={<IntegrationsDefinitionsContent />}
          dataUpdatedDate={dataUpdatedDate}
          tableContent={
            <Table
              headers={[
                { title: "Month " },
                {
                  title: "GP2GP transfers received ",
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
                        (paper copy requested){" "}
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
                text: "Integration times for registering practice",
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

export default PracticeIntegrationTimes;
