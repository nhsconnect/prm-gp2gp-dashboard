import React from "react";
import classNames from "classnames";

export const Button = ({ className, children, type, onClick, dataTestId }) => (
  <button
    data-testid={dataTestId}
    className={classNames("nhsuk-button", className)}
    type={type}
    onClick={onClick}
  >
    {children}
  </button>
);
