import React, { useState, useEffect } from "react";
import PracticeDetails from "../components/PracticeDetails/index";
import { getPracticeDetails } from "../library/api/ODSPortal";
import { convertMonthNumberToText } from "../library/common/index";

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
  const month = convertMonthNumberToText(pageContext.month);
  const year = pageContext.year;

  return (
    <React.Fragment>
      <PracticeDetails name={name} ODSCode={ODSCode} address={address} />
      <hr />
      <h2 className="nhsuk-heading-m">
        {month} {year}
      </h2>
    </React.Fragment>
  );
};

export default Practice;
