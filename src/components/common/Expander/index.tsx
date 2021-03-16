import React, { ReactNode } from "react";
import { FC } from "react";

type ExpanderProps = {
  title: string;
  content: ReactNode;
};

export const Expander: FC<ExpanderProps> = ({ title, content }) => {
  return (
    <details className="nhsuk-details nhsuk-expander">
      <summary className="nhsuk-details__summary">
        <span className="nhsuk-details__summary-text">{title}</span>
      </summary>
      <div className="nhsuk-details__text">{content}</div>
    </details>
  );
};
