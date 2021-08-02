import React, { FC } from "react";
import { AboutThisDataContent } from "../AboutThisDataContent";
import { Expander } from "../common/Expander";
import { PracticeTableWithSort } from "../PracticeTableWithSort";

import { PracticeType } from "../../templates/Practice/practice.types";

import practiceTableContent from "../../data/content/practiceTable.json";
import ccgContent from "../../data/content/ccg.json";
import eightDayExpanderContent from "../../data/content/eightDayExpander.json";

import "./index.scss";

type CcgPageContentProps = {
  ccgPractices: PracticeType[];
};

export const CcgPageContent: FC<CcgPageContentProps> = ({ ccgPractices }) => {
  return (
    <>
      <div className="nhsuk-u-reading-width">
        <p className="nhsuk-body">
          {ccgContent.tableDescription} More information{" "}
          <a href="#about-this-data">about this data</a>.
        </p>
      </div>

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
        ccgPractices={ccgPractices}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
      />
      <AboutThisDataContent />
    </>
  );
};
