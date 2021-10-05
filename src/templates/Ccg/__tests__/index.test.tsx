import React from "react";

import { render } from "@testing-library/react";

import Ccg from "..";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("CCG template", () => {
  beforeEach(() => {
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showTabsView: true });
  });
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
  };

  it("renders CCG details correctly", () => {
    const expectedPracticeName = "GP Practice - A12345";
    const expectedCCGHeading = "Burton CCG - 12A";

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    expect(getByText(expectedCCGHeading)).toBeInTheDocument();
    expect(getByText(expectedPracticeName)).toBeInTheDocument();
  });

  it("renders table title correctly", () => {
    const { getByRole } = render(<Ccg pageContext={pipelineCCGData} />);

    const tableTitle = getByRole("heading", {
      name: "Integration times for February 2020",
      level: 2,
    });

    expect(tableTitle).toBeInTheDocument();
  });

  it("renders table description correctly", () => {
    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    const tableDescription = getByText(
      "The table below shows the number of GP2GP transfers",
      { exact: false }
    );

    expect(tableDescription).toBeInTheDocument();
  });

  it("displays CCG practices and hides about and definitions content", () => {
    const definitionsText =
      "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent.";

    const { getByText, queryByText, getAllByRole } = render(
      <Ccg pageContext={pipelineCCGData} />
    );

    const allRows = getAllByRole("row");

    expect(getByText("GP Practice - A12345")).toBeInTheDocument();
    expect(getByText("Second GP Practice - A12346")).toBeInTheDocument();
    expect(allRows[1]).toHaveTextContent("Transfers received 22");
    expect(allRows[1]).toHaveTextContent("Integrated within 3 days 22.7%");
    expect(allRows[1]).toHaveTextContent("Integrated within 8 days 27.3%");
    expect(allRows[1]).toHaveTextContent(
      "Not integrated within 8 days (paper copy sent) 50%"
    );

    expect(
      queryByText("This site is updated 14 days after the end of each month.", {
        exact: false,
      })
    ).not.toBeInTheDocument();

    expect(
      queryByText(definitionsText, {
        exact: false,
      })
    ).not.toBeInTheDocument();
  });
});
