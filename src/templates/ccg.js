import React from "react";
import { Helmet } from "react-helmet";

import OrganisationDetails from "../components/OrganisationDetails";
import { convertToTitleCase } from "../library/utils/convertToTitleCase/index";
import PracticeTable from "../components/PracticeTable";
import { ODS_PORTAL_URL } from "../library/api/ODSPortal";
import { useApi } from "../library/hooks/useApi";

import organisationMetadata from "../data/organisations/organisationMetadata.json";
import ccgContent from "../data/content/ccg.json";

const Ccg = ({ pageContext }) => {
  const { name, odsCode } = pageContext;
  const formattedName = convertToTitleCase(name);

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
        <p>{ccgContent.loadingMessage}</p>
      ) : error ? (
        <p>{ccgContent.errorMessage}</p>
      ) : (
        <PracticeTable
          ccgPractices={data?.Organisations}
          validPractices={organisationMetadata.practices}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
export default Ccg;
