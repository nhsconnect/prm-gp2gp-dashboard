import React, { FC } from "react";
import "./index.scss";

type SelectProps = {
  label: string;
  options: string[];
  id: string;
};

export const Select: FC<SelectProps> = ({ label, options, id }) => (
  <div className="nhsuk-form-group">
    <label className="nhsuk-label" htmlFor={id}>
      {label}
    </label>
    <select className="nhsuk-select" id={id} name={id}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
