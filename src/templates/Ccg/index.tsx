import React, { FC } from "react";
import { Helmet } from "react-helmet";

import OrganisationDetails from "../../components/OrganisationDetails";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import PracticeTable from "./PracticeTable";
import { ODS_PORTAL_URL } from "../../library/api/ODSPortal";
import { useApi } from "../../library/hooks/useApi";
import ccgContent from "../../data/content/ccg.json";
import "./index.scss";
import { AboutThisDataContent } from "../common/AboutThisDataContent";

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

  function getContent() {
    if (isLoading) {
      return <p className="nhsuk-body">{ccgContent.loadingMessage}</p>;
    }
    if (error) {
      return <p className="nhsuk-body">{ccgContent.errorMessage}</p>;
    }
    return (
      <div>
        <p className="nhsuk-body">
          The table below shows the time to integrate for records received by
          the practices within this Clinical Commissioning Group (CCG). More
          information <a href={"#about-this-data"}>about this data</a>.
        </p>

        <PracticeTable
          ccgPractices={data?.Organisations}
          validPractices={validPractices}
        />
        <AboutThisDataContent />
      </div>
    );
  }

  return (
    <>
      <Helmet
        title={`${formattedName} | ${odsCode} - GP Registrations Data Platform`}
      />
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      {getContent()}
    </>
  );
};
export default Ccg;
