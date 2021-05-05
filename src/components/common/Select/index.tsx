import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

type SelectProps = {
  label: string;
  options: { displayText: string; value: string }[];
  id: string;
  defaultValue: string;
  handleValueChange: (value: string) => void;
  className?: string;
};

export const Select: FC<SelectProps> = ({
  label,
  options,
  id,
  defaultValue,
  handleValueChange,
  className,
}) => (
  <div className={classNames("gp2gp-form-group", className)}>
    <label className="nhsuk-label" htmlFor={id}>
      {label}
    </label>
    <select
      className="gp2gp-select"
      id={id}
      name={id}
      defaultValue={defaultValue}
      onChange={e => handleValueChange(e.target.value)}
    >
      {options.map(({ displayText, value }) => (
        <option key={value} value={value}>
          {displayText}
        </option>
      ))}
    </select>
  </div>
);
