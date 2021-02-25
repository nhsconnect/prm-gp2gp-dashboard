import React, { FC } from "react";
import { Helmet } from "react-helmet";

import OrganisationDetails from "../components/OrganisationDetails";
import { convertToTitleCase } from "../library/utils/convertToTitleCase";
import PracticeTable from "../components/PracticeTable";
import { ODS_PORTAL_URL } from "../library/api/ODSPortal";
import { useApi } from "../library/hooks/useApi";

import ccgContent from "../data/content/ccg.json";

type PageContext = {
  odsCode: string;
  name: string;
  validPractices: any;
};

type CcgProps = {
  pageContext: PageContext;
};

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
        <PracticeTable
          ccgPractices={data?.Organisations}
          validPractices={validPractices}
        />
      )}
    </>
  );
};
export default Ccg;
