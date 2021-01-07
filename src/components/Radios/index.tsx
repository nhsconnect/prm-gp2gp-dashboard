import React, { FC, useState } from "react";
import "./index.scss";

type RadioOption = {
  displayValue: string;
  value: string;
};

type RadiosProps = {
  title: string;
  options: RadioOption[];
  buttonLabel: string;
  callback: (selectedOption: string) => void;
  defaultValue?: string;
};

const Radios: FC<RadiosProps> = ({
  title,
  options,
  buttonLabel,
  callback,
  defaultValue = "",
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  return (
    <fieldset className="nhsuk-fieldset">
      <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--l">
        <h3 className="nhsuk-fieldset__heading">{title}</h3>
      </legend>
      <div className="nhsuk-radios">
        {options.map((option, index) => {
          const optionId = `option-${index}`;
          return (
            <div className="nhsuk-radios__item" key={optionId}>
              <input
                className="nhsuk-radios__input"
                id={optionId}
                type="radio"
                value={option.value}
                checked={option.value === selectedValue}
                onChange={() => {
                  setSelectedValue(option.value);
                }}
              />
              <label
                className="nhsuk-label nhsuk-radios__label"
                htmlFor={optionId}
              >
                {option.displayValue}
              </label>
            </div>
          );
        })}
      </div>
      <a
        onClick={() => {
          callback(selectedValue);
        }}
        href={"#"}
      >
        {buttonLabel}
      </a>
    </fieldset>
  );
};

export default Radios;
