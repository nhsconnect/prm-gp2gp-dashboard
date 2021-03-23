import React from "react";
import { render, waitFor } from "@testing-library/react";
import Layout from "../";

describe("Homepage layout", () => {
  it("displays header and footer", async () => {
    const { getByRole } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const header = getByRole("banner");
      const footer = getByRole("contentinfo");

      expect(header).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });
  });

  it("displays children", async () => {
    const { getByTestId, getByText } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <div data-testid="test-div">
          <h1>This is title</h1>
        </div>
      </Layout>
    );

    await waitFor(() => {
      const testDiv = getByTestId("test-div");

      expect(testDiv).toBeInTheDocument();
      expect(getByText("This is title")).toBeInTheDocument();
    });
  });

  it("displays cookie banner", async () => {
    const { getByLabelText } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const cookieBanner = getByLabelText("Cookie banner");

      expect(cookieBanner).toBeInTheDocument();
    });
  });

  it("displays feedback banner", async () => {
    const { getByRole } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const feedbackBannerHeading = getByRole("heading", {
        name: "Tell us what you think",
      });

      expect(feedbackBannerHeading).toBeInTheDocument();
    });
  });

  it("displays hero banner", async () => {
    const { getByRole } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const heroBannerHeading = getByRole("heading", {
        name: "GP2GP patient record transfers data",
      });

      expect(heroBannerHeading).toBeInTheDocument();
    });
  });

  it("does not display back to search link", async () => {
    const { queryByRole } = render(
      <Layout path="/" pageContext={{ layout: "homepage" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const backToSearchLink = queryByRole("link", {
        name: "Back to search",
      });

      expect(backToSearchLink).not.toBeInTheDocument();
    });
  });
});
