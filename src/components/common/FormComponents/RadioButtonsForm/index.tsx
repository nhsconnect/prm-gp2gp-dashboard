import React, { FC } from "react";

type RadioButtonsFormProps = {
  submitText: string;
  handleSubmit: () => void;
};

export const RadioButtonsForm: FC<RadioButtonsFormProps> = ({
  submitText,
  handleSubmit,
}) => {
  return (
    <div className={"nhsuk-form-group"}>
      <form onSubmit={handleSubmit}>
        <button type="submit">{submitText}</button>
      </form>
    </div>
  );
};
