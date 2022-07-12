import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { SICBLDirectory } from "../components/SicblDirectory";

const SubICBLocations: FC = () => {
  return (
    <>
      <Helmet>
        <title>Sub ICB Location A to Z - GP Registrations Data</title>
        <meta
          name="description"
          content="Alphabetical list of all Sub ICB Locations in England"
        />
      </Helmet>
      <SICBLDirectory headingPriority={1} />
    </>
  );
};
export default SubICBLocations;
