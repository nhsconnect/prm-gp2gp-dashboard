import React, { FC, ReactNode } from "react";
import { Expander } from "../common/Expander";
import eightDayExpanderContent from "../../data/content/eightDayExpander.json";
import { Tabs } from "../Tabs";
import { AboutThisDataContent } from "../AboutThisDataContent";
import { DefinitionsContent } from "../Definitions";
import "./index.scss";

type PageContentProps = {
  title: string;
  tableDescription: string;
  tableContent: ReactNode;
};

export const PageContent: FC<PageContentProps> = ({
  title,
  tableDescription,
  tableContent,
}) => {
  return (
    <section className="gp2gp-page-content-section">
      <h2>{title}</h2>
      <div className="nhsuk-u-reading-width">
        <p className="nhsuk-body">{tableDescription}</p>
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
      <Tabs
        tabs={[
          {
            title: "Data table",
            content: tableContent,
          },
          { title: "About", content: <AboutThisDataContent /> },
          { title: "Definitions", content: <DefinitionsContent /> },
        ]}
      />
      <noscript>
        {tableContent}
        <AboutThisDataContent />
        <DefinitionsContent />
      </noscript>
    </section>
  );
};
