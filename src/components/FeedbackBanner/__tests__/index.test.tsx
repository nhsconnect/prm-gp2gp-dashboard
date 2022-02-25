import React from "react";
import { render } from "@testing-library/react";

import { FeedbackBanner } from "../";

describe("FeedbackBanner component", () => {
  it("displays feedback heading", () => {
    const { getByRole } = render(<FeedbackBanner />);

    const feedbackBannerHeading = getByRole("heading", {
      name: "Get in touch",
      level: 3,
    });
    expect(feedbackBannerHeading).toBeInTheDocument();
  });

  it("displays paragraph text", () => {
    const { getByText } = render(<FeedbackBanner />);

    const paragraphText = getByText(
      /We are always looking to improve our site./i
    );
    expect(paragraphText).toBeInTheDocument();
  });

  it("contains link to feedback survey", () => {
    const { getByRole } = render(<FeedbackBanner />);
    const surveyLink = getByRole("link", {
      name: "Take our survey",
    });

    expect(surveyLink.getAttribute("href")).toBe(
      "https://qfreeaccountssjc1.az1.qualtrics.com/jfe/form/SV_ac1GS7jmHNtMTlA"
    );
  });

  it("contains link to GP Registrations Data email", () => {
    const { getByRole } = render(<FeedbackBanner />);
    const surveyLink = getByRole("link", {
      name: "gp-registrations-data@nhs.net",
    });

    const surveyHref = surveyLink.getAttribute("href");

    expect(surveyHref).toContain(
      "body=Please note we are unable to assist with individual patient or practice queries."
    );
    expect(surveyHref).toContain("mailto:gp-registrations-data@nhs.net");
  });
});
