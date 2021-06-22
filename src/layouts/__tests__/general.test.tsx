import React from "react";
import { render, waitFor } from "@testing-library/react";
import Layout from "../";

describe("General layout", () => {
  it("displays header and footer", async () => {
    const { getByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
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
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
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

  it("does not display cookie banner on cookie policy page", async () => {
    const { queryByLabelText } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const cookieBanner = queryByLabelText("Cookie banner");
      expect(cookieBanner).not.toBeInTheDocument();
    });
  });

  it("displays cookie banner on accessibility page", async () => {
    const { getByLabelText } = render(
      <Layout
        path="/accessibility-statement/"
        pageContext={{ layout: "general" }}
      >
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const cookieBanner = getByLabelText("Cookie banner");

      expect(cookieBanner).toBeInTheDocument();
    });
  });

  it("displays feedback heading", async () => {
    const { getByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const feedbackHeading = getByRole("heading", {
        name: "Tell us what you think",
        level: 3,
      });
      expect(feedbackHeading).toBeInTheDocument();
    });
  });

  it("does not display hero banner", async () => {
    const { queryByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const heroBannerHeading = queryByRole("heading", {
        name: "GP2GP patient record transfers data",
      });
      expect(heroBannerHeading).not.toBeInTheDocument();
    });
  });

  it("displays back to search link", async () => {
    const { getAllByRole } = render(
      <Layout path="/cookies-policy/" pageContext={{ layout: "general" }}>
        <p>This is a paragraph.</p>
      </Layout>
    );

    await waitFor(() => {
      const backToSearchLink = getAllByRole("link", {
        name: "Back to search",
      })[0];

      expect(backToSearchLink).toBeInTheDocument();
      expect(backToSearchLink.getAttribute("href")).toBe("/");
    });
  });
});
