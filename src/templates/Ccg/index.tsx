import React, { FC } from "react";
import { Helmet } from "react-helmet";

import OrganisationDetails from "../../components/OrganisationDetails";
import PracticeTable from "../../components/CCGPracticeTable";
import { AboutThisDataContent } from "../../components/AboutThisDataContent";
import { Expander } from "../../components/Expander";
import { Practice } from "../Practice/index";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { ODS_PORTAL_URL } from "../../library/api/ODSPortal";
import { useApi } from "../../library/hooks/useApi";
import ccgContent from "../../data/content/ccg.json";
import "./index.scss";

type PageContext = {
  odsCode: string;
  name: string;
  validPractices: Practice[];
};

type CcgProps = {
  pageContext: PageContext;
};

type CcgContentProps = {
  organisations: any;
  validPractices: Practice[];
};

const CcgContent: FC<CcgContentProps> = ({ organisations, validPractices }) => (
  <>
    <p className="nhsuk-body">
      {ccgContent.tableDescription} More information{" "}
      <a href="#about-this-data">about this data</a>.
    </p>

    <Expander
      title={ccgContent.expanderTitle}
      content={
        <>
          <p>{ccgContent.expanderFirstParagraph}</p>
          <p>{ccgContent.expanderSecondParagraph}</p>
        </>
      }
    />

    <PracticeTable
      ccgPractices={organisations}
      validPractices={validPractices}
    />
    <AboutThisDataContent />
  </>
);

const Ccg: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, validPractices } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const { data, error, isLoading } = useApi(ODS_PORTAL_URL, {
    RelTypeId: "RE4",
    TargetOrgId: odsCode,
    RelStatus: "active",
    Limit: 1000,
  });

  return (
    <>
      <Helmet title={`${formattedName} | ${odsCode}`} />
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      {isLoading ? (
        <p className="nhsuk-body">{ccgContent.loadingMessage}</p>
      ) : error ? (
        <p className="nhsuk-body">{ccgContent.errorMessage}</p>
      ) : (
        <CcgContent
          organisations={data.Organisations}
          validPractices={validPractices}
        />
      )}
    </>
  );
};
export default Ccg;
