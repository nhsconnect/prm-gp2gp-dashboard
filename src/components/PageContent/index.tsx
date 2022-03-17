import React, { FC, ReactNode } from "react";
import { Expander } from "../common/Expander";
import { Tabs } from "../Tabs";
import { AboutThisDataContent } from "../AboutThisDataContent";
import "./index.scss";
import { convertToReadableDate } from "../../library/utils/convertToReadableDate";

type PageContentProps = {
  title: string;
  tableDescription: ReactNode;
  tableContent: ReactNode;
  className?: string;
  expanderTitle: string;
  expanderContent: ReactNode;
  definitionsContent: ReactNode;
  dataUpdatedDate: string;
};

export const PageContent: FC<PageContentProps> = ({
  title,
  tableDescription,
  tableContent,
  className = "",
  expanderTitle,
  expanderContent,
  definitionsContent,
  dataUpdatedDate,
}) => {
  const formattedDataUpdatedDate = convertToReadableDate(dataUpdatedDate);

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
      <p className="nhsuk-body-s nhsuk-u-secondary-text-color nhsuk-u-margin-top-5 nhsuk-u-margin-bottom-0">
        Data updated: {formattedDataUpdatedDate} <br />
        New data is added around 15th of each month{" "}
      </p>
      <noscript>
        {tableContent}
        <AboutThisDataContent />
        {definitionsContent}
      </noscript>
    </section>
  );
};
