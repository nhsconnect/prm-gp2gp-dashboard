import React, { FC } from "react";
import "./index.scss";

type SelectProps = {
  label: string;
  options: { displayText: string; value: string }[];
  id: string;
  defaultValue: string;
};

export const Select: FC<SelectProps> = ({
  label,
  options,
  id,
  defaultValue,
}) => (
  <div className="nhsuk-form-group">
    <label className="nhsuk-label" htmlFor={id}>
      {label}
    </label>
    <select
      className="nhsuk-select"
      id={id}
      name={id}
      defaultValue={defaultValue}
    >
      {options.map(({ displayText, value }) => (
        <option key={value} value={value}>
          {displayText}
        </option>
      ))}
    </select>
  </div>
);
