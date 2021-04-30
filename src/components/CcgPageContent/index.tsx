import React, { FC } from "react";
import { AboutThisDataContent } from "../AboutThisDataContent";
import { Expander } from "../common/Expander";
import { PracticeTableWithSort } from "../PracticeTableWithSort";

import { PracticeType } from "../../templates/Practice/practice.types";

import practiceTableContent from "../../data/content/practiceTable.json";
import ccgContent from "../../data/content/ccg.json";
import eightDayExpanderContent from "../../data/content/eightDayExpander.json";

import { Search } from "../../library/utils/search";

import "./index.scss";

type CcgPageContentProps = {
  ccgPractices: { OrgId: string; Name: string }[];
  validPractices: PracticeType[];
};

export const CcgPageContent: FC<CcgPageContentProps> = ({
  ccgPractices,
  validPractices,
}) => {
  const practiceSearch = new Search("OrgId", ["OrgId"], ccgPractices);
  const filteredPractices = validPractices.filter(
    practice => practiceSearch.search(practice.odsCode).length > 0
  );

  if (filteredPractices.length === 0)
    return <p>{practiceTableContent.noResultsMessage}</p>;

  return (
    <>
      <p className="nhsuk-body">
        {ccgContent.tableDescription} More information{" "}
        <a href="#about-this-data">about this data</a>.
      </p>

      <Expander
        title={eightDayExpanderContent.title}
        content={
          <>
            <p>{eightDayExpanderContent.firstParagraph}</p>
            <p>{eightDayExpanderContent.secondParagraph}</p>
          </>
        }
      />

      <PracticeTableWithSort
        filteredPractices={filteredPractices}
        headers={practiceTableContent.headers}
        sortByOptions={practiceTableContent.sortByOptions}
      />
      <AboutThisDataContent />
    </>
  );
};
