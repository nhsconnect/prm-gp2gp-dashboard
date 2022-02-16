import React, { FC, ReactNode } from "react";
import { Expander } from "../common/Expander";
import { Tabs } from "../Tabs";
import { AboutThisDataContent } from "../AboutThisDataContent";
import "./index.scss";

type PageContentProps = {
  title: string;
  tableDescription: ReactNode;
  tableContent: ReactNode;
  className?: string;
  expanderTitle: string;
  expanderContent: ReactNode;
  definitionsContent: ReactNode;
};

export const PageContent: FC<PageContentProps> = ({
  title,
  tableDescription,
  tableContent,
  className = "",
  expanderTitle,
  expanderContent,
  definitionsContent,
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
          { title: "Definitions", content: definitionsContent },
        ]}
      />
      <noscript>
        {tableContent}
        <AboutThisDataContent />
        {definitionsContent}
      </noscript>
    </section>
  );
};
