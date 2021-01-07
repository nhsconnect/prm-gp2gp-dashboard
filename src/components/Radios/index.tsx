import React, { FC } from "react";
import "./index.scss";

type RadiosProps = {
  title: string;
  options: string[];
};

const Radios: FC<RadiosProps> = ({ title, options }) => {
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
                value="no"
              />
              <label
                className="nhsuk-label nhsuk-radios__label"
                htmlFor={optionId}
              >
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default Radios;
