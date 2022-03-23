import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PracticeTable } from "../";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import unitsContent from "../../../data/content/unitsOptions.json";
import { PageTemplatePath } from "../../../library/enums/pageTemplatePath";

const integrationTableHeaders = [
  { title: "Requesting practice name " },
  { title: "GP2GP transfers received " },
  { title: "Integrated within 3 days " },
  { title: "Integrated within 8 days " },
  { title: "Not integrated within 8 days " },
];

describe("PracticeTable component", () => {
  it("should display correct table caption for transfers requested page path", () => {
    const tableCaptionText = "Integration times for registering practices";

    const { getByText } = render(
      <PracticeTable
        metrics={practiceMetricsMock[0].metrics}
        headers={integrationTableHeaders}
        tableCaption={`${tableCaptionText}`}
        pageTemplatePath={PageTemplatePath.IntegrationTimes}
      />
    );

    const tableCaption = getByText(`${tableCaptionText}`);

    expect(tableCaption).toBeInTheDocument();
  });

  it("displays practices data as percentages by default, then as numbers when selected", () => {
    const { getAllByRole, getByRole } = render(
      <PracticeTable
        metrics={practiceMetricsMock[0].metrics}
        headers={integrationTableHeaders}
        tableCaption={"Some table title"}
        pageTemplatePath={PageTemplatePath.IntegrationTimes}
      />
    );

    const allRows = getAllByRole("row");

    const unitsSelect = getByRole("combobox", {
      name: `Units${unitsContent.selectHiddenLabel}`,
    });

    expect(unitsSelect).toHaveValue("percentages");

    expect(allRows[1]).toHaveTextContent("Not integrated within 8 days n/a");

    userEvent.selectOptions(unitsSelect, "numbers");
    expect(unitsSelect).toHaveValue("numbers");

    expect(allRows[1]).toHaveTextContent("Not integrated within 8 days 0");
  });
});
