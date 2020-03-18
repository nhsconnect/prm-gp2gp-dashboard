import React, { Fragment } from "react";
import classNames from "classnames";

const Input = ({
  type,
  hint,
  error,
  onChange,
  className,
  testid,
  children,
}) => (
  <Fragment>
    <label date-testid={`${testid}-label`}>
      {children}
      {hint && (
        <span className="nhsuk-hint" data-testid={`${testid}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span
          className="nhsuk-error-message"
          data-testid={`${testid}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
      <input
        className={classNames(
          "nhsuk-input",
          {
            "nhsuk-input--error": !!error,
          },
          className
        )}
        type={type}
        onChange={onChange}
        data-testid={`${testid}-input`}
        aria-invalid={!!error}
      />
    </label>
  </Fragment>
);

export default Input;
