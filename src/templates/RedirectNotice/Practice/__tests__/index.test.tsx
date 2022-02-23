import React from "react";
import { render } from "@testing-library/react";
import Practice from "../index";

jest.mock("no-scroll");

const practicePageContext = {
  odsCode: "B86030",
  name: "BURTON CROFT SURGERY",
  layout: "general",
};

describe("Practice template", () => {
  it("displays redirect notice", () => {
    const { getByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    const expectedRedirectTitle = getByRole("heading", {
      name: "This page has been moved.",
      level: 1,
    });
    expect(expectedRedirectTitle).toBeInTheDocument();

    const expectedRedirectLink = getByRole("link", {
      name: "Burton Croft Surgery - B86030 integration times",
    });
    expect(expectedRedirectLink.getAttribute("href")).toBe(
      "/practice/B86030/integration-times"
    );
  });
});
