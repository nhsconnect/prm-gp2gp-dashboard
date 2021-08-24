import React, { FC } from "react";
import { Expander } from "../common/Expander";
import eightDayExpanderContent from "../../data/content/eightDayExpander.json";

type PageContentProps = {
  title: string;
  tableDescription: string;
};

export const PageContent: FC<PageContentProps> = ({
  title,
  tableDescription,
}) => {
  return (
    <div>
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
    </div>
  );
};
