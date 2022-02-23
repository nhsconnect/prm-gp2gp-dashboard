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
          <div className="nhsuk-radios__item" key={"transfers-requested"}>
            <input
              className="nhsuk-radios__input"
              id="transfers-requested"
              type="radio"
              name="radio-input-1"
              value="Transfers requested"
              defaultChecked={true}
            />
            <label
              className="nhsuk-label nhsuk-radios__label"
              htmlFor={"transfers-requested"}
            >
              {"Transfers requested"}
            </label>
          </div>
          <div className="nhsuk-radios__item" key={"integration-times"}>
            <input
              className="nhsuk-radios__input"
              id="integration-times"
              type="radio"
              name="radio-input-1"
              value="Integration times"
              defaultChecked={false}
            />
            <label
              className="nhsuk-label nhsuk-radios__label"
              htmlFor={"integration-times"}
            >
              {"Integration times"}
            </label>
          </div>
        </div>
        <button type="submit">{submitText}</button>
      </form>
    </div>
  );
};
