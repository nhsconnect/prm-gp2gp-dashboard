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

  it("contains link to GP2GP email", () => {
    const { getByRole } = render(<FeedbackBanner />);
    const surveyLink = getByRole("link", {
      name: "gp2gp@nhs.net",
    });

    expect(surveyLink.getAttribute("href")).toBe("mailto:gp2gp@nhs.net");
  });
});
