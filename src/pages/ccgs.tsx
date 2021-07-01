import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { CcgDirectory } from "../components/CcgDirectory";

const Ccgs: FC = () => {
  return (
    <>
      <Helmet>
        <title>CCG A to Z - GP Registrations Data</title>
        <meta
          name="description"
          content="Alphabetical list of all CCGs in England"
        />
      </Helmet>
      <CcgDirectory />
    </>
  );
};
export default Ccgs;
