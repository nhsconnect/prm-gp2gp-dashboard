import React from "react";
import moxios from "moxios";

import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { act } from "react-dom/test-utils";

import Ccg from "../ccg";
import { mockAPIResponse } from "../../../__mocks__/api";

jest.mock(
  "../../data/organisations/organisationMetadata.json",
  () => ({
    practices: [{ odsCode: "A12345", name: "A Practice" }],
  }),
  { virtual: true }
);

describe("CCG template", () => {
  it("renders CCG details correctly", async () => {
    moxios.install();
    const pipelineCCGData = {
      odsCode: "12A",
      name: "BURTON CCG",
    };
    const expectedCCGName = "Burton CCG";

    const statusCode = 200;
    const mockedResponse = {
      Organisations: [{ OrgId: "A12345", Name: "A Practice" }],
    };
    const expectedPracticeName = "A Practice | A12345";

    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

    await act(async () => {
      await waitFor(() => {
        expect(getByText(pipelineCCGData.odsCode)).toBeInTheDocument();
        expect(getByText(expectedCCGName)).toBeInTheDocument();
        expect(getByText(expectedPracticeName)).toBeInTheDocument();
      });
    });
    moxios.uninstall();
  });
});
