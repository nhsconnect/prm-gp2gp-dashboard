import React, { useState, useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import PracticeDetails from "../components/PracticeDetails/index";
import { fetchPracticeDataByODSCode } from "../library/api/ODSPortal";

const Index = ({ pageContext }) => {
  const [practiceDetails, setPracticeDetails] = useState({});
  useEffect(() => {
    (async () => {
      const data = await fetchPracticeDataByODSCode(pageContext.ODSCode);
      setPracticeDetails(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { name, ODSCode, address } = practiceDetails;

  return (
    !isEmpty(practiceDetails) && (
      <PracticeDetails name={name} ODSCode={ODSCode} address={address} />
    )
  );
};

export default Index;
