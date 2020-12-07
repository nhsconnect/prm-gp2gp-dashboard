import React from "react";
import classNames from "classnames";

const Button = ({ className, children, type, onClick }) => (
  <button
    className={classNames("nhsuk-button", className)}
    type={type}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
