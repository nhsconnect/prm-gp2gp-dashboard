import React, { Fragment } from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../components/OrganisationDetails";
import { convertToTitleCase } from "../library/common/index";
import { useApi } from "../library/hooks/useApi/index";
import { ODS_PORTAL_URL } from "../library/api/ODSPortal";

const Ccg = ({ pageContext }) => {
  const [isLoading, apiData, apiErr] = useApi(ODS_PORTAL_URL, {
    RelTypeId: "RE4",
    TargetOrgId: pageContext.odsCode,
    RelStatus: "active",
    Limit: 1000,
  });

  const { name, odsCode } = pageContext;
  const formattedName = convertToTitleCase(name);

  return (
    <Fragment>
      <Helmet title={`${formattedName} | ${odsCode}`} />
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      {!isLoading && (
        <ul>
          {apiData.Organisations.map(org => (
            <li>
              <Link to={`/practice/${org.OrgId}`}>
                {org.Name} | {org.OrgId}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
};

export default Ccg;
