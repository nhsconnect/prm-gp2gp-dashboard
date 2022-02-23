import React, { FC, FormEvent } from "react";

type RadioButtonsFormProps = {
  submitText: string;
  onSubmit: (event: { [k: string]: FormDataEntryValue }) => void;
};

export const RadioButtonsForm: FC<RadioButtonsFormProps> = ({
  submitText,
  onSubmit,
}) => {
  function handleSubmit(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    onSubmit(formProps);
  }

  return (
    <div className={"nhsuk-form-group nhsuk-radio-buttons-form"}>
      <form onSubmit={handleSubmit} data-testid="nhsuk-radio-buttons-form">
        <legend className="gp2gp-fieldset__legend nhsuk-u-margin-bottom-4 nhsuk-u-padding-top-2">
          <h3 className="nhsuk-fieldset__heading ">
            Which dataset you would like to download?
          </h3>
        </legend>
        <div className="nhsuk-radios">
          <div className="nhsuk-radios__item" key={"radio-input-datasets"}>
            <input
              className="nhsuk-radios__input"
              id="radio-input-datasets"
              type="radio"
              name="radio-input-1"
              value="Transfers requested"
              defaultChecked={true}
            />
            <label
              className="nhsuk-label nhsuk-radios__label"
              htmlFor={"radio-input-datasets"}
            >
              {"Transfers requested"}
            </label>
          </div>
        </div>
        <button type="submit">{submitText}</button>
      </form>
    </div>
  );
};
