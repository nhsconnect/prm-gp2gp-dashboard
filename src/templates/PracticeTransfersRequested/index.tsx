import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../components/OrganisationAddress";
import { PracticeType } from "./practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { ContentsList } from "../../components/common/ContentsList";
import "../index.scss";
import { TransfersRequestedDefinitionsContent } from "../../components/Definitions";
import { PageContent } from "../../components/PageContent";

type PageContext = {
  practice: PracticeType;
  layout: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const PracticeTransfersRequested: FC<PracticeProps> = ({
  pageContext: { practice },
}) => {
  const { name, odsCode } = practice;
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
          tableContent=""
        />
      </div>
    </>
  );
};

export default PracticeTransfersRequested;
