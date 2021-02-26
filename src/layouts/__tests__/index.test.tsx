import React from "react";
import { render } from "@testing-library/react";
import Layout from "../index";

describe("Layout component", () => {
  beforeEach(() => {
    // supress svg warning
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  it("displays layout components on the home page", () => {
    const { getByTestId, getByRole, getByLabelText } = render(
      <Layout path="/">
        <div data-testid="test-div">
          <h1>This is title</h1>
        </div>
      </Layout>
    );

    const header = getByRole("banner");
    const footer = getByRole("contentinfo");
    const cookieBanner = getByLabelText("Cookie banner");
    const feedbackBannerHeading = getByRole("heading", {
      name: "Tell us what you think",
    });
    const testDiv = getByTestId("test-div");

    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(cookieBanner).toBeInTheDocument();
    expect(feedbackBannerHeading).toBeInTheDocument();
    expect(testDiv).toBeInTheDocument();
  });

  it("should not display cookie banner on the cookie page", async () => {
    const { queryByLabelText } = render(
      <Layout path="/cookies-policy/">
        <div></div>
      </Layout>
    );

    const cookieBanner = queryByLabelText("Cookie banner");

    expect(cookieBanner).not.toBeInTheDocument();
  });
});
