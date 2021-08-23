import React, { FC } from "react";
import { AboutThisDataContent } from "../AboutThisDataContent";
import { Expander } from "../common/Expander";
import { PracticeTableWithSort } from "../PracticeTableWithSort";

import { PracticeType } from "../../templates/Practice/practice.types";

import practiceTableContent from "../../data/content/practiceTable.json";
import ccgContent from "../../data/content/ccg.json";
import eightDayExpanderContent from "../../data/content/eightDayExpander.json";
import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";

import "./index.scss";
import { Tabs } from "../Tabs";
import { DefinitionsContent } from "../Definitions";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";

type CcgPageContentProps = {
  ccgPractices: PracticeType[];
};

export const CcgPageContent: FC<CcgPageContentProps> = ({ ccgPractices }) => {
  const { year, month } = ccgPractices[0].metrics[0];
  const tableTitle = `Integration times for ${convertMonthNumberToText(
    month
  )} ${year}`;

  const { showTabsView } = useFeatureToggles();
  const NoTabsContent = () => (
    <>
      <PracticeTableWithSort
        ccgPractices={ccgPractices}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
        tableCaption={tableTitle}
      />
      <h2 id="about-this-data" className="nhsuk-u-margin-top-6">
        About this data
      </h2>
      <AboutThisDataContent />
      <DefinitionsContent />
    </>
  );

  return (
    <section className="gp2gp-table-section">
      <h2>{tableTitle}</h2>
      <div className="nhsuk-u-reading-width">
        <p className="nhsuk-body">{ccgContent.tableDescription}</p>
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

      {showTabsView ? (
        <Tabs
          tabs={[
            {
              title: "Data table",
              content: (
                <PracticeTableWithSort
                  ccgPractices={ccgPractices}
                  headers={practiceTableContent.headers}
                  sortBySelect={practiceTableContent.sortBySelect}
                  orderSelect={practiceTableContent.orderSelect}
                  tableCaption={tableTitle}
                />
              ),
            },
            { title: "About", content: <AboutThisDataContent /> },
            { title: "Definitions", content: <DefinitionsContent /> },
          ]}
        />
      ) : (
        <NoTabsContent />
      )}
    </section>
  );
};
