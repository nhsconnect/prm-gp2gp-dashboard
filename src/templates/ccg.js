import React from "react";
import { Helmet } from "react-helmet";

import OrganisationDetails from "../components/OrganisationDetails";
import { convertToTitleCase } from "../library/common/index";
import PracticeTable from "../components/PracticeTable";
import { ODS_PORTAL_URL } from "../library/api/ODSPortal";
import { useApi } from "../library/hooks/useApi";

import organisationMetadata from "../data/organisations/organisationMetadata.json";

const Ccg = ({ pageContext }) => {
  const { name, odsCode } = pageContext;
  const formattedName = convertToTitleCase(name);

  const [, apiData, apiErr] = useApi(ODS_PORTAL_URL, {
    RelTypeId: "RE4",
    TargetOrgId: odsCode,
    RelStatus: "active",
    Limit: 1000,
  });

  return (
    <>
      <Helmet title={`${formattedName} | ${odsCode}`} />
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      <PracticeTable
        ccgPractices={apiData?.Organisations}
        validPractices={organisationMetadata.practices}
      />
      {apiErr && `${apiErr} Error loading practices`}
    </>
  );
};
export default Ccg;
