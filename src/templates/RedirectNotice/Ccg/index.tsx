import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { RedirectNotice } from "../../../components/RedirectNotice";

type PageContext = {
  odsCode: string;
  name: string;
  layout: string;
};

type CcgProps = {
  pageContext: PageContext;
};

const Ccg: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
      </Helmet>
      <RedirectNotice
        redirectLink={`/ccg/${odsCode}/integration-times`}
        linkText={`${formattedName} - ${odsCode} integration times`}
      />
    </>
  );
};
export default Ccg;
