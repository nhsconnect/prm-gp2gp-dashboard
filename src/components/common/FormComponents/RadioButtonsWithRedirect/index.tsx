import React, { FC, useState } from "react";
import { Link } from "gatsby";
import "./index.scss";

type RadioOption = {
  displayValue: string;
  value: string;
};

type RadioButtonsWithRedirectProps = {
  title: string;
  options: RadioOption[];
  linkLabel: string;
  redirectURL: string;
  callback: (selectedOption: string) => void;
  defaultValue?: string;
};

export const RadioButtonsWithRedirect: FC<RadioButtonsWithRedirectProps> = ({
  title,
  options,
  linkLabel,
  redirectURL,
  callback,
  defaultValue = "",
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  return (
    <fieldset className="gp2gp-fieldset">
      <legend className="gp2gp-fieldset__legend nhsuk-u-margin-bottom-4 nhsuk-u-padding-top-2">
        <h3 className="nhsuk-fieldset__heading ">{title}</h3>
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
                name="radio-input"
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
      <Link
        onClick={() => {
          callback(selectedValue);
        }}
        className="nhsuk-button nhsuk-u-margin-top-6"
        type="submit"
        to={redirectURL}
      >
        {linkLabel}
      </Link>
    </fieldset>
  );
};
