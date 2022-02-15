import React, { FC, ReactNode } from "react";
import { Expander } from "../common/Expander";
import { Tabs } from "../Tabs";
import { AboutThisDataContent } from "../AboutThisDataContent";
import { DefinitionsContent, WhyIntegrateWithin8Days } from "../Definitions";
import "./index.scss";

type PageContentProps = {
  title: string;
  tableDescription: ReactNode;
  tableContent: ReactNode;
  className?: string;
  expanderTitle: string;
  expanderContent: ReactNode;
};

export const PageContent: FC<PageContentProps> = ({
  title,
  tableDescription,
  tableContent,
  className = "",
  expanderTitle,
  expanderContent,
}) => {
  return (
    <section className={`gp2gp-page-content-section ${className}`}>
      <h2>{title}</h2>
      <div className="nhsuk-u-reading-width">
        <div className="nhsuk-body">{tableDescription}</div>
      </div>

      <Expander title={expanderTitle} content={expanderContent} />
      <Tabs
        tabs={[
          {
            title: "Data table",
            content: tableContent,
          },
          { title: "Notes about this data", content: <AboutThisDataContent /> },
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
