import React, { useEffect, useState } from "react";

import { useSearch } from "../../library/hooks/useSearch";
import PracticeRow from "../PracticeRow";

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const [filteredPractices, setFilteredPractices] = useState(null);
  const search = useSearch({
    uniqueSearchKey: "odsCode",
    searchKeys: ["odsCode"],
    sourceDocuments: validPractices,
  });

  useEffect(() => {
    if (!!ccgPractices && !!search.search) {
      const practices = ccgPractices.filter(
        ccg => search.search(ccg.OrgId).length > 0
      );
      setFilteredPractices(practices);
    }
  }, [ccgPractices, search]);

  return !filteredPractices ? (
    <p>Loading...</p>
  ) : !filteredPractices.length ? (
    <p>No practices found</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Practice Name</th>
        </tr>
      </thead>
      <tbody>
        {filteredPractices.map(org => (
          <PracticeRow key={org.OrgId} odsCode={org.OrgId} name={org.Name} />
        ))}
      </tbody>
    </table>
  );
};
export default PracticeTable;
