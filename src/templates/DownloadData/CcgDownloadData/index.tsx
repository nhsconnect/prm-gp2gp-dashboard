import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { PracticeType } from "../../../library/types/practice.types";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { ContentsList } from "../../../components/common/ContentsList";
import "../../index.scss";
import { DownloadData } from "../../../components/DownloadData";

type PageContext = {
  odsCode: string;
  name: string;
  ccgPractices: PracticeType[];
  layout: string;
};

type CcgProps = {
  pageContext: PageContext;
};

const CcgDownloadData: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const contentListItems = [
    {
      text: "Integration times",
    },
    {
      text: "GP2GP transfers requested",
      href: `/ccg/${odsCode}/GP2GP-transfers-requested`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-sort, .gp2gp-tabs, .gp2gp-open-modal-btn {display: none}</style>`}</noscript>
      </Helmet>
      <div className="gp2gp-page-content-wrapper">
        <h1 className="nhsuk-u-margin-bottom-5 gp2gp-page-heading">
          {formattedName ? `${formattedName} - ${odsCode}` : odsCode}
        </h1>
        <span className="nhsuk-u-visually-hidden">download data</span>
        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <DownloadData
          callback={() => {}}
          pageDescription={
            "To download data for this CCG in CSV format select from the options below and click 'Download'."
          }
        />
      </div>
    </>
  );
};
export default CcgDownloadData;
