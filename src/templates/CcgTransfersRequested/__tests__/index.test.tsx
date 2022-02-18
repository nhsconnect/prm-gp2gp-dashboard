import React from "react";

import { findByLabelText, render, within } from "@testing-library/react";

import CcgTransfersRequested from "..";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

import userEvent from "@testing-library/user-event";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";

jest.mock("no-scroll");

describe("CCG Transfers Requested template", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
    layout: "general",
  };

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const ccgWithoutNameData = {
      odsCode,
      name: "",
      ccgPractices: practiceMetricsMock,
      layout: "general",
    };

    const { getByRole } = render(
      <CcgTransfersRequested pageContext={ccgWithoutNameData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: odsCode,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders CCG name and ODS code title correctly", () => {
    const ccgHeadingText = "Burton CCG - 12A";

    const { getByRole } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: ccgHeadingText,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const pageTitle = getByRole("heading", {
      name: "GP2GP transfers requested for registering practices",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const tableDescription = getByText(
      "number of registrations that triggered a GP2GP transfer",
      { exact: false }
    );

    expect(tableDescription).toBeInTheDocument();
  });

  it("displays contents navigation", async () => {
    const { getByRole, getByLabelText } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const contentsHeader = getByRole("heading", {
      name: "Contents",
      level: 2,
    });
    const labelText = getByLabelText("List of links to pages");

    expect(contentsHeader).toBeInTheDocument();
    expect(labelText).toBeInTheDocument();
  });
});
