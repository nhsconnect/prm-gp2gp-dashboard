import React, { FC } from "react";
import "./index.scss";

type RadioOption = {
  displayValue: string;
  value: string;
};

type RadioProps = {
  title: string;
  className?: string;
  radioId: string;
  options: RadioOption[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
};

export const Radio: FC<RadioProps> = ({
  title,
  className = "",
  radioId,
  options,
  selectedValue,
  setSelectedValue,
}) => {
  return (
    <fieldset className="gp2gp-fieldset">
      <legend className="gp2gp-fieldset__legend nhsuk-u-margin-bottom-4 nhsuk-u-padding-top-2">
        <h3 className="nhsuk-fieldset__heading ">{title}</h3>
      </legend>
      <div className={`nhsuk-radios ${className}`}>
        {options.map((option, index) => {
          const optionId = `${radioId}-option-${index}`;
          return (
            <div className="nhsuk-radios__item" key={optionId}>
              <input
                className="nhsuk-radios__input"
                id={optionId}
                type="radio"
                name={"radio-input-" + radioId}
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
    </fieldset>
  );
};
