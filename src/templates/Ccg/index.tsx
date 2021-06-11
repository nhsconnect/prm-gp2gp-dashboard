import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { OrganisationDetails } from "../../components/OrganisationDetails";
import { CcgPageContent } from "../../components/CcgPageContent";
import { PracticeType } from "../Practice/practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import "./index.scss";

type PageContext = {
  odsCode: string;
  name: string;
  validPractices: PracticeType[];
};

type CcgProps = {
  pageContext: PageContext;
};

const Ccg: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, validPractices } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  return (
    <>
      <Helmet title={`${formattedName} | ${odsCode}`} />
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      <CcgPageContent validPractices={validPractices} />
    </>
  );
};
export default Ccg;
