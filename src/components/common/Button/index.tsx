import React, { FC, MouseEventHandler } from "react";
import classNames from "classnames";

type ButtonProps = {
  className: string;
  children: FC;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: MouseEventHandler;
  dataTestId?: string;
};

export const Button: FC<ButtonProps> = ({
  className,
  children,
  type,
  onClick,
  dataTestId,
}) => (
  <button
    data-testid={dataTestId}
    className={classNames("nhsuk-button", className)}
    type={type}
    onClick={onClick}
  >
    {children}
  </button>
);
