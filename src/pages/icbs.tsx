import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { ICBDirectory } from "../components/IcbDirectory";

const ICBs: FC = () => {
  return (
    <>
      <Helmet>
        <title>ICB A to Z - GP Registrations Data</title>
        <meta
          name="description"
          content="Alphabetical list of all ICBs in England"
        />
      </Helmet>
      <ICBDirectory headingPriority={1} />
    </>
  );
};
export default ICBs;
