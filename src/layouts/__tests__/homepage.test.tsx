import React from "react";
import { render } from "@testing-library/react";
import Layout from "../index";

describe("Homepage layout", () => {
  it("displays header and footer", () => {
    const { getByRole } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
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
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <div data-testid="test-div">
          <h1>This is title</h1>
        </div>
      </Layout>
    );

    const testDiv = getByTestId("test-div");

    expect(testDiv).toBeInTheDocument();
    expect(getByText("This is title")).toBeInTheDocument();
  });

  it("displays cookie banner", () => {
    const { getByLabelText } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const cookieBanner = getByLabelText("Cookie banner");

    expect(cookieBanner).toBeInTheDocument();
  });

  it("displays feedback banner", () => {
    const { getByRole } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const feedbackBannerHeading = getByRole("heading", {
      name: "Tell us what you think",
    });

    expect(feedbackBannerHeading).toBeInTheDocument();
  });

  it("displays hero banner", () => {
    const { getByRole } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    const heroBannerHeading = getByRole("heading", {
      name: "GP2GP patient record transfers data",
    });

    expect(heroBannerHeading).toBeInTheDocument();
  });
});
