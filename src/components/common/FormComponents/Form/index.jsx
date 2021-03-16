import React from "react";
import classNames from "classnames";

export const Form = ({ onSubmit, hasError, children }) => (
  <div
    data-testid="gp2gp-practice-search__input"
    className={classNames("nhsuk-form-group", {
      "nhsuk-form-group--error": hasError,
    })}
  >
    <form onSubmit={onSubmit}>{children}</form>
  </div>
);
