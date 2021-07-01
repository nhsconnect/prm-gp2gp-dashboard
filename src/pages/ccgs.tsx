import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { CcgType } from "../templates/Ccg/ccg.types";
import { CcgDirectory } from "../components/CcgDirectory";

type CcgsProps = {
  pageContext: { ccgs: CcgType[] };
};

const Ccgs: FC<CcgsProps> = ({ pageContext: { ccgs } }) => {
  return (
    <>
      <Helmet>
        <title>CCG A to Z - GP Registrations Data</title>
        <meta
          name="description"
          content="Alphabetical list of all CCGs in England"
        />
      </Helmet>
      <CcgDirectory ccgs={ccgs} />
    </>
  );
};
export default Ccgs;
