import React from "react";
import moxios from "moxios";

import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import Ccg from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

describe("CCG template", () => {
  beforeAll(() => {
    moxios.install();
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it("renders CCG details correctly", async () => {
    const pipelineCCGData = {
      odsCode: "12A",
      name: "BURTON CCG",
      validPractices: practiceMetricsMock,
    };
    const statusCode = 200;
    const mockedResponse = {
      Organisations: [{ OrgId: "A12345", Name: "GP PRACTICE" }],
    };
    const expectedPracticeName = "GP Practice - A12345";
    const expectedCCGHeading = "Burton CCG - 12A";

    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await waitFor(() => {
      expect(getByText(expectedCCGHeading)).toBeInTheDocument();
      expect(getByText(expectedPracticeName)).toBeInTheDocument();
    });
  });

  it("displays error when API is down", async () => {
    const pipelineCCGData = {
      odsCode: "12A",
      name: "BURTON CCG",
      validPractices: practiceMetricsMock,
    };
    const expectedCCGHeading = "Burton CCG - 12A";

    const statusCode = 500;

    mockAPIResponse(statusCode);

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await waitFor(() => {
      expect(getByText(expectedCCGHeading)).toBeInTheDocument();
      expect(getByText("Error loading practice list")).toBeInTheDocument();
    });
  });
});
