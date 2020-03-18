import React from "react";
import classNames from "classnames";

const Form = ({ onSubmit, hasError, children }) => (
  <div
    className={classNames("nhsuk-form-group", {
      "nhsuk-form-group--error": hasError,
    })}
  >
    <form onSubmit={onSubmit}>{children}</form>
  </div>
);

export default Form;
