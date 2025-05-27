import React from "react";
import { render } from "@testing-library/react";
import { OrganisationAddress } from "../";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";
import { waitFor } from "@testing-library/dom";

jest.mock("axios");

describe("OrganisationAddress component", () => {

  it("displays full organisation address in the correct order", async () => {
    const statusCode = 200;
    const ODSPracticeData = {
      odsCode: "B86030",
      town: "Leeds",
      postCode: "LS15 8BA",
      lines: {
        AddrLn1: "15",
        AddrLn2: "Austhorpe Road",
        AddrLn3: "Crossgates",
      },
    };
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    const testId = "organisation-address";
    const { getByTestId } = render(<OrganisationAddress odsCode="B86030" />);

    await waitFor(() => {
      const addressNode = getByTestId(testId).children;

      expect(addressNode[0]).toHaveTextContent(ODSPracticeData.lines.AddrLn1);
      expect(addressNode[1]).toHaveTextContent(ODSPracticeData.lines.AddrLn2);
      expect(addressNode[2]).toHaveTextContent(ODSPracticeData.lines.AddrLn3);
      expect(addressNode[3]).toHaveTextContent(ODSPracticeData.town);
      expect(addressNode[4]).toHaveTextContent(ODSPracticeData.postCode);
    });
  });

  it("displays organisation address correctly with one address line", async () => {
    const statusCode = 200;
    const ODSPracticeData = {
      odsCode: "B86030",
      town: "Leeds",
      postCode: "LS15 8BA",
      lines: {
        AddrLn1: "15 Austhorpe Road",
      },
    };
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    const testId = "organisation-address";
    const { getByText, getByTestId } = render(
      <OrganisationAddress odsCode="B86031" />
    );

    await waitFor(() => {
      const addressNode = getByTestId(testId).children;

      expect(addressNode.length).toEqual(3);
      expect(getByText(ODSPracticeData.lines.AddrLn1)).toBeInTheDocument();
      expect(getByText(ODSPracticeData.postCode)).toBeInTheDocument();
      expect(getByText(ODSPracticeData.town)).toBeInTheDocument();
    });
  });

  it("displays organisation post code and town if there are no address lines", async () => {
    const statusCode = 200;
    const ODSPracticeData = {
      odsCode: "B86030",
      town: "Leeds",
      postCode: "LS15 8BA",
    };
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    const testId = "organisation-address";
    const { getByText, getByTestId } = render(
      <OrganisationAddress odsCode="B86032" />
    );

    await waitFor(() => {
      const addressNode = getByTestId(testId).children;

      expect(addressNode.length).toEqual(2);
      expect(getByText(ODSPracticeData.postCode)).toBeInTheDocument();
      expect(getByText(ODSPracticeData.town)).toBeInTheDocument();
    });
  });

  it("does not render practice address when API responds with an error", async () => {
    const statusCode = 500;
    mockAPIResponse(statusCode);

    const { queryByTestId, getByRole } = render(
      <OrganisationAddress odsCode="B86032" />
    );

    await waitFor(() => {
      expect(queryByTestId("organisation-address")).not.toBeInTheDocument();
    });
  });
});
