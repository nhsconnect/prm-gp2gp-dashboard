import React from "react";
import { Helmet } from "react-helmet";

import OrganisationDetails from "../components/OrganisationDetails";
import { convertToTitleCase } from "../library/utils/convertToTitleCase/index";
import PracticeTable from "../components/PracticeTable";
import { ODS_PORTAL_URL } from "../library/api/ODSPortal";
import { useApi } from "../library/hooks/useApi";

import practiceMetrics from "../data/organisations/practiceMetrics.json";
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
        <p className="nhsuk-body">{ccgContent.loadingMessage}</p>
      ) : error ? (
        <p className="nhsuk-body">{ccgContent.errorMessage}</p>
      ) : (
        <PracticeTable
          ccgPractices={data?.Organisations}
          validPractices={practiceMetrics.practices}
        />
      )}
    </>
  );
};
export default Ccg;
