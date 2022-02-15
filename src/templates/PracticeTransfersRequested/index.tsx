import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../components/OrganisationAddress";
import { PracticeType } from "./practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { ContentsList } from "../../components/common/ContentsList";
import "../index.scss";

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
      </div>
    </>
  );
};

export default PracticeTransfersRequested;
