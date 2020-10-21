import React from "react";
import classNames from "classnames";

const Input = ({ error, onChange, className, testid }) => (
  <input
    className={classNames(
      "nhsuk-input",
      {
        "nhsuk-input--error": !!error,
      },
      className
    )}
    type="text"
    onChange={onChange}
    data-testid={`${testid}-input`}
    aria-invalid={!!error}
  />
);

export default Input;
