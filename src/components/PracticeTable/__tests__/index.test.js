import React from "react";
import { render } from "@testing-library/react";
import PracticeTable from "../index";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import * as featureToggle from "../../../library/hooks/useFeatureToggle/index";

describe("PracticeTable component", () => {
  beforeAll(() => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(true);
  });
  it("displays multiple valid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];
    const validPractices = [
      ...practiceMetricsMock,
      {
        odsCode: "B12345",
        name: "GP Practice 2",
        metrics: [
          {
            requester: {
              timeToIntegrateSla: {
                within3Days: 0,
                within8Days: 2,
                beyond8Days: 5,
              },
            },
          },
        ],
      },
    ];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(getByText("GP Practice 2 | B12345")).toBeInTheDocument();
  });

  it("filters out invalid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];

    const { queryByText, getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(queryByText("GP Practice 2 | B12345")).not.toBeInTheDocument();
  });

  it("displays a message if there are no valid practices", () => {
    const ccgPractices = [{ OrgId: "B12345", Name: "GP Practice 2" }];
    const validPractices = [{ odsCode: "A12345", name: "GP Practice" }];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("No GP practices found")).toBeInTheDocument();
  });

  it("displays table headers", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByRole } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(
      getByRole("columnheader", { name: "Practice name" })
    ).toBeInTheDocument();
    expect(
      getByRole("columnheader", { name: "Within 3 days" })
    ).toBeInTheDocument();
    expect(
      getByRole("columnheader", { name: "Within 8 days" })
    ).toBeInTheDocument();
    expect(
      getByRole("columnheader", { name: "Beyond 8 day target" })
    ).toBeInTheDocument();
  });
  it("displays table title", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(
      getByText("Practice performance for February 2020")
    ).toBeInTheDocument();
  });
});
