import React from "react";

import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import Ccg from "..";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

describe("CCG template", () => {
  it("renders CCG details correctly", async () => {
    const pipelineCCGData = {
      odsCode: "12A",
      name: "BURTON CCG",
      ccgPractices: practiceMetricsMock,
    };
    const expectedPracticeName = "GP Practice - A12345";
    const expectedCCGHeading = "Burton CCG - 12A";

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await waitFor(() => {
      expect(getByText(expectedCCGHeading)).toBeInTheDocument();
      expect(getByText(expectedPracticeName)).toBeInTheDocument();
    });
  });
});
