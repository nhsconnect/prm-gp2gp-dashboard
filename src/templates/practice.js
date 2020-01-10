import React, { useState, useEffect } from "react";
import PracticeDetails from "../components/PracticeDetails/index";
import { getPracticeDetails } from "../library/api/ODSPortal";

const Practice = ({ pageContext }) => {
  const [practiceDetails, setPracticeDetails] = useState({
    ODSCode: pageContext.ODSCode,
  });
  useEffect(() => {
    (async () => {
      const data = await getPracticeDetails(pageContext.ODSCode);
      setPracticeDetails(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { name, ODSCode, address } = practiceDetails;

  return <PracticeDetails name={name} ODSCode={ODSCode} address={address} />;
};

export default Practice;
