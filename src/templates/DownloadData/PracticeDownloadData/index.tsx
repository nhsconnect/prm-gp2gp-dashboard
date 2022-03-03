import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../../components/OrganisationAddress";
import { ContentsList } from "../../../components/common/ContentsList";
import { PracticeType } from "../../../library/types/practice.types";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import "../../index.scss";
import { DownloadData } from "../../../components/DownloadData";
import { getFormatData } from "../../../library/utils/download/getFormatData/getFormatData";

type PageContext = {
  practice: PracticeType;
  layout: string;
  ccgOdsCode: string;
  ccgName: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const PracticeDownloadData: FC<PracticeProps> = ({
  pageContext: { practice, ccgOdsCode, ccgName },
}) => {
  const { name, odsCode } = practice;
  const formattedName = convertToTitleCase(name);
  const contentListItems = [
    {
      text: "Integration times",
      href: `/practice/${odsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
      href: `/practice/${odsCode}/GP2GP-transfers-requested`,
    },
    {
      text: "Download data",
    },
  ];
  const formatData = getFormatData([practice], ccgName, ccgOdsCode);

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
            <span className="nhsuk-u-visually-hidden">download data</span>
          </h1>
          <OrganisationAddress odsCode={odsCode} />
          <hr aria-hidden={true} />
        </div>

        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <DownloadData
          formatData={formatData}
          pageDescription={
            "To download data for this practice in CSV format select from the options below and click 'Download'."
          }
        />
      </div>
    </>
  );
};

export default PracticeDownloadData;