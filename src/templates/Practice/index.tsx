import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { PracticeType } from "../PracticeIntegrationTimes/practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { RedirectNotice } from "../../components/RedirectNotice";

type PageContext = {
  practice: PracticeType;
  layout: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const Practice: FC<PracticeProps> = ({ pageContext: { practice } }) => {
  const { name, odsCode } = practice;
  const formattedName = convertToTitleCase(name);

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for this practice"
        />
      </Helmet>
      <RedirectNotice
        redirectLink={`/practice/${odsCode}/integration-times`}
        linkText={`${formattedName} - ${odsCode} integration times`}
      />
    </>
  );
};

export default Practice;
