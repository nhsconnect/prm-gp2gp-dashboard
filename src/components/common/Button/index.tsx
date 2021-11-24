import React, { FC, MouseEventHandler } from "react";
import classNames from "classnames";

type ButtonProps = {
  className: string;
  children: FC;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: MouseEventHandler;
  dataTestId?: string;
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({
  className,
  children,
  type,
  onClick,
  dataTestId,
  disabled,
}) => (
  <button
    data-testid={dataTestId}
    className={classNames("nhsuk-button", className)}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
