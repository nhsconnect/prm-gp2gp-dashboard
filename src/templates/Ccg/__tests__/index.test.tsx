import React from "react";
import moxios from "moxios";

import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { act } from "react-dom/test-utils";

import Ccg from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import userEvent from "@testing-library/user-event";

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
    const expectedCCGName = "Burton CCG";

    const statusCode = 200;
    const mockedResponse = {
      Organisations: [{ OrgId: "A12345", Name: "GP PRACTICE" }],
    };
    const expectedPracticeName = "GP Practice | A12345";

    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await act(async () => {
      await waitFor(() => {
        expect(getByText(pipelineCCGData.odsCode)).toBeInTheDocument();
        expect(getByText(expectedCCGName)).toBeInTheDocument();
        expect(getByText(expectedPracticeName)).toBeInTheDocument();
      });
    });
  });

  it("displays CCG 'About this data' header correctly", async () => {
    const pipelineCCGData = {
      odsCode: "12A",
      name: "BURTON CCG",
      validPractices: practiceMetricsMock,
    };

    const statusCode = 200;
    const mockedResponse = {
      Organisations: [{ OrgId: "A12345", Name: "GP PRACTICE" }],
    };

    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await waitFor(() => {
      expect(getByText("About this data")).toBeInTheDocument();
    });
  });

  it("should display expander with the correct content", async () => {
    const pipelineCCGData = {
      odsCode: "12A",
      name: "BURTON CCG",
      validPractices: practiceMetricsMock,
    };

    const statusCode = 200;
    const mockedResponse = {
      Organisations: [{ OrgId: "A12345", Name: "GP PRACTICE" }],
    };

    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await waitFor(() => {
      const expanderTitle = getByText("Why integrate within 8 days?");
      const expanderContent = getByText(
        "This increases the burden on both the sending and receiving",
        { exact: false }
      );
      expect(expanderTitle).toBeInTheDocument();
      expect(expanderContent).not.toBeVisible();

      userEvent.click(expanderTitle);
      expect(expanderContent).toBeVisible();
    });
  });

  it("displays error when API is down", async () => {
    const pipelineCCGData = {
      odsCode: "12A",
      name: "BURTON CCG",
      validPractices: practiceMetricsMock,
    };
    const expectedCCGName = "Burton CCG";

    const statusCode = 500;

    mockAPIResponse(statusCode);

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await act(async () => {
      await waitFor(() => {
        expect(getByText(pipelineCCGData.odsCode)).toBeInTheDocument();
        expect(getByText(expectedCCGName)).toBeInTheDocument();
        expect(getByText("Error loading practice list")).toBeInTheDocument();
      });
    });
  });
});
