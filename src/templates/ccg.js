import React from "react";
import { Helmet } from "react-helmet";

import OrganisationDetails from "../components/OrganisationDetails";
import { convertToTitleCase } from "../library/utils/convertToTitleCase/index";
import PracticeTable from "../components/PracticeTable";
import { ODS_PORTAL_URL } from "../library/api/ODSPortal";
import { useApi } from "../library/hooks/useApi";

import organisationMetadata from "../data/organisations/organisationMetadata.json";

const Ccg = ({ pageContext }) => {
  const { name, odsCode } = pageContext;
  const formattedName = convertToTitleCase(name);

  const { data, error } = useApi(ODS_PORTAL_URL, {
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
        ccgPractices={data?.Organisations}
        validPractices={organisationMetadata.practices}
      />
      {error && `${error} Error loading practices`}
    </>
  );
};
export default Ccg;
