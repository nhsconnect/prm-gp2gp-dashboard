import React, { FC } from "react";

const NationalStatistics: FC = () => {
  return (
    <>
      <h1>National data on GP2GP performance</h1>
      <p>The data below shows the GP2GP performance nationally</p>
      <p>
        The data for this month extends to 8 days into the following month, so
        that we can identify whether transfers initiated on the last day of the
        month were integrated within the 8 day SLA. There may be some transfers
        that have been initiated in this time period and will be integrated in
        the future, which will not be represented in this data.
      </p>
    </>
  );
};

export default NationalStatistics;
