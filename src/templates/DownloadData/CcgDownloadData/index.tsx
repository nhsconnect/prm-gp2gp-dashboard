import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { PracticeType } from "../../../library/types/practice.types";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { ContentsList } from "../../../components/common/ContentsList";
import "../../index.scss";
import { DownloadData } from "../../../components/DownloadData";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";
import { getFormatData } from "../../../library/utils/download/getFormatData";

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
  const { name: ccgName, odsCode: ccgOdsCode, ccgPractices } = pageContext;
  const formattedName: string = convertToTitleCase(ccgName);
  const { showContentsNavigation } = useFeatureToggles();
  const contentListItems = [
    {
      text: "Integration times",
      href: `/ccg/${ccgOdsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
      href: `/ccg/${ccgOdsCode}/gp2gp-transfers-requested`,
    },
    {
      text: "Download data",
    },
  ];

  const formatData = getFormatData(ccgPractices, ccgName, ccgOdsCode);

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${ccgOdsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-download-data {display: none}</style>`}</noscript>
      </Helmet>
      {showContentsNavigation ? (
        <div className="gp2gp-page-content-wrapper">
          <h1 className="nhsuk-u-margin-bottom-5 gp2gp-page-heading">
            {formattedName ? `${formattedName} - ${ccgOdsCode}` : ccgOdsCode}
            <span className="nhsuk-u-visually-hidden"> download data</span>
          </h1>
          <div className="gp2gp-side-nav">
            <ContentsList items={contentListItems} />
          </div>
          <DownloadData
            className="gp2gp-page-contents"
            dataFor={formattedName}
            formatData={formatData}
            pageDescription={
              "To download data for this CCG in CSV format select from the options below and click 'Download'."
            }
          />
        </div>
      ) : (
        <>
          <h1 className="nhsuk-u-margin-bottom-5">
            {formattedName ? `${formattedName} - ${ccgOdsCode}` : ccgOdsCode}
            <span className="nhsuk-u-visually-hidden"> download data</span>
          </h1>
          <DownloadData
            dataFor={formattedName}
            formatData={formatData}
            pageDescription={
              "To download data for this CCG in CSV format select from the options below and click 'Download'."
            }
          />
        </>
      )}
    </>
  );
};
export default CcgDownloadData;
