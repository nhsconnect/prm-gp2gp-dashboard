import React, { ChangeEvent, FC, useState } from "react";
import "./index.scss";

type SelectProps = {
  label: string;
  options: { displayText: string; value: string }[];
  id: string;
  defaultValue: string;
  handleValueChange?: (value: string) => void;
};

export const Select: FC<SelectProps> = ({
  label,
  options,
  id,
  defaultValue,
  handleValueChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    if (handleValueChange) handleValueChange(event.target.value);
  };

  return (
    <div className="nhsuk-form-group">
      <label className="nhsuk-label" htmlFor={id}>
        {label}
      </label>
      <select
        className="nhsuk-select"
        id={id}
        name={id}
        value={selectedValue}
        onChange={handleOnChange}
      >
        {options.map(({ displayText, value }) => (
          <option key={value} value={value}>
            {displayText}
          </option>
        ))}
      </select>
    </div>
  );
};
