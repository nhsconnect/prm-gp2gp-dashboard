import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationDetails } from "../../components/OrganisationDetails";
import { Table } from "../../components/common/Table";

import { PracticeMetricsType, PracticeType } from "./practice.types";

import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { useApi } from "../../library/hooks/useApi";

import { PageContent } from "../../components/PageContent";
import { generateMetricsTableData } from "../../library/utils/generateMetricsTableData";
import { HelpModal } from "../../components/common/HelpModal";
import {
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  NotIntegratedWithin8DaysDefinition,
  TransfersReceivedDefinition,
} from "../../components/Definitions";

import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";

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

const Practice: FC<PracticeProps> = ({ pageContext: { practice } }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${practice.odsCode}`
  );

  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  const { showDefinitionsModals } = useFeatureToggles();

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for this practice"
        />
        <noscript>{`<style>.gp2gp-tabs {display: none}</style>`}</noscript>
      </Helmet>
      {isLoading || error ? (
        <OrganisationDetails name={formattedName} odsCode={odsCode} />
      ) : (
        <OrganisationDetails
          name={formattedName}
          odsCode={odsCode}
          address={transformPracticeAddress(data.Organisation.GeoLoc.Location)}
        />
      )}
      <hr aria-hidden={true} />

      <PageContent
        title="Integration times"
        tableDescription="The table below shows the number of GP2GP transfers received by the practice and the time it took for these records to be integrated."
        tableContent={
          showDefinitionsModals ? (
            <Table
              headers={[
                { title: "Month " },
                {
                  title: "Transfers received ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy=""
                      iconHiddenDescription="Open modal with definition"
                      content={<TransfersReceivedDefinition ariaLabelId="" />}
                    />
                  ),
                },
                {
                  title: "Integrated within 3 days ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy=""
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <IntegratedWithin3DaysDefinition ariaLabelId="" />
                      }
                    />
                  ),
                },
                {
                  title: "Integrated within 8 days ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy=""
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <IntegratedWithin8DaysDefinition ariaLabelId="" />
                      }
                    />
                  ),
                },
                {
                  title: "Not integrated within 8 days ",
                  extra: (
                    <>
                      <div className="gp2gp-title-emphasis">
                        (paper copy sent){" "}
                      </div>
                      <HelpModal
                        ariaLabelledBy=""
                        iconHiddenDescription="Open modal with definition"
                        content={
                          <NotIntegratedWithin8DaysDefinition ariaLabelId="" />
                        }
                      />
                    </>
                  ),
                },
              ]}
              caption={{
                text: "Integration times for the recent months",
                hidden: true,
              }}
              rows={generateMonthlyRowData(metrics)}
            />
          ) : (
            <Table
              headers={[
                { title: "Month " },
                {
                  title: "Transfers received ",
                },
                {
                  title: "Integrated within 3 days ",
                },
                {
                  title: "Integrated within 8 days ",
                },
                {
                  title: "Not integrated within 8 days ",
                  extra: (
                    <div className="gp2gp-title-emphasis">
                      (paper copy sent){" "}
                    </div>
                  ),
                },
              ]}
              caption={{
                text: "Integration times for the recent months",
                hidden: true,
              }}
              rows={generateMonthlyRowData(metrics)}
            />
          )
        }
      />
    </>
  );
};

export default Practice;
