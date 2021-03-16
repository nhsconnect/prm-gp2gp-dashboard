import React from "react";
import { render } from "@testing-library/react";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";

import Layout from "../";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";

jest.mock("../../library/hooks/useFeatureToggle");

describe("General layout", () => {
  beforeEach(() => {
    when(mocked(useFeatureToggle))
      .calledWith("F_BACK_TO_SEARCH_LINK")
      .mockReturnValue(true);
  });

  it("displays header and footer", () => {
    const { getByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const header = getByRole("banner");
    const footer = getByRole("contentinfo");

    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it("displays children", () => {
    const { getByTestId, getByText } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <div data-testid="test-div">
          <h1>This is title</h1>
        </div>
      </Layout>
    );

    const testDiv = getByTestId("test-div");

    expect(testDiv).toBeInTheDocument();
    expect(getByText("This is title")).toBeInTheDocument();
  });

  it("does not display cookie banner on cookie policy page", () => {
    const { queryByLabelText } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const cookieBanner = queryByLabelText("Cookie banner");

    expect(cookieBanner).not.toBeInTheDocument();
  });

  it("displays cookie banner on accessibility page", () => {
    const { getByLabelText } = render(
      <Layout
        path="/accessibility-statement/"
        pageContext={{ layout: "general" }}
      >
        <p>This is a paragraph.</p>
      </Layout>
    );

    const cookieBanner = getByLabelText("Cookie banner");

    expect(cookieBanner).toBeInTheDocument();
  });

  it("displays feedback banner", () => {
    const { getByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const feedbackBannerHeading = getByRole("heading", {
      name: "Tell us what you think",
    });

    expect(feedbackBannerHeading).toBeInTheDocument();
  });

  it("does not display hero banner", () => {
    const { queryByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const heroBannerHeading = queryByRole("heading", {
      name: "GP2GP patient record transfers data",
    });

    expect(heroBannerHeading).not.toBeInTheDocument();
  });

  it("displays back to search link", () => {
    const { getByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const backToSearchLink = getByRole("link", {
      name: "Back to search",
    });

    expect(backToSearchLink).toBeInTheDocument();
    expect(backToSearchLink.getAttribute("href")).toBe("/");
  });

  it("does not display back to search link when F_BACK_TO_SEARCH_LINK is off", () => {
    when(mocked(useFeatureToggle))
      .calledWith("F_BACK_TO_SEARCH_LINK")
      .mockReturnValue(false);

    const { queryByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const backToSearchLink = queryByRole("link", {
      name: "Back to search",
    });

    expect(backToSearchLink).not.toBeInTheDocument();
  });
});
