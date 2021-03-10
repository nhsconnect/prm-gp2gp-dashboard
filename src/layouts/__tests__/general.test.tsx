import React from "react";
import { render } from "@testing-library/react";
import Layout from "../index";

describe("General layout", () => {
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
});
