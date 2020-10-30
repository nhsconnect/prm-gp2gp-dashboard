import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import OrganisationDetails from "../components/OrganisationDetails";
import { convertToTitleCase } from "../library/common/index";

const Ccg = ({ pageContext }) => {
  const { name, odsCode } = pageContext;
  const formattedName = convertToTitleCase(name);

  return (
    <Fragment>
      <Helmet title={`${formattedName} | ${odsCode}`} />
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
    </Fragment>
  );
};

export default Ccg;
