import React from "react";
import classNames from "classnames";

const Button = ({ className, children, type, testid }) => (
  <button
    className={classNames("nhsuk-button", className)}
    type={type}
    data-testid={testid}
  >
    {children}
  </button>
);

export default Button;
