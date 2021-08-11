import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { OrganisationDetails } from "../../components/OrganisationDetails";
import { CcgPageContent } from "../../components/CcgPageContent";
import { PracticeType } from "../Practice/practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";

type PageContext = {
  odsCode: string;
  name: string;
  ccgPractices: PracticeType[];
};

type CcgProps = {
  pageContext: PageContext;
};

const Ccg: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, ccgPractices } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-sort {display: none}</style>`}</noscript>
      </Helmet>
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      <CcgPageContent ccgPractices={ccgPractices} />
    </>
  );
};
export default Ccg;
