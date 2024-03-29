import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as cookies from "react-cookie";
import { CookieBanner } from "../";
import { waitFor } from "@testing-library/dom";

jest.mock("react-cookie", () => ({
  useCookies: jest.fn(),
}));

describe("CookieBanner component", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-12-08T11:30:00.000Z").getTime()
    );
  });

  it("displays cookie banner if cookies are not set", () => {
    jest.spyOn(cookies, "useCookies").mockImplementation(() => [{}, () => {}]);

    const { getByLabelText } = render(<CookieBanner />);

    expect(getByLabelText("Cookie banner")).toBeInTheDocument();
  });

  it("does not display cookie banner if cookies are set", () => {
    jest
      .spyOn(cookies, "useCookies")
      .mockImplementation(() => [{ "nhsuk-cookie-consent": "true" }, () => {}]);

    const { queryByLabelText } = render(<CookieBanner />);

    expect(queryByLabelText("Cookie banner")).not.toBeInTheDocument();
  });

  it("sets consent to true and the cookie expiry date if agree button pressed", async () => {
    const mockSetCookie = jest.fn();
    jest
      .spyOn(cookies, "useCookies")
      .mockImplementation(() => [{}, mockSetCookie]);

    const { getByRole, getByLabelText } = render(<CookieBanner />);

    const agreeButton = getByRole("button", {
      name: "I'm OK with analytics cookies",
    });
    userEvent.click(agreeButton);

    await waitFor(() => {
      expect(mockSetCookie).toBeCalledWith("nhsuk-cookie-consent", "true", {
        expires: new Date(2021, 2, 8, 10, 30),
      });

      const confirmationBanner = getByLabelText(
        "Cookie setting success banner"
      );
      expect(confirmationBanner).toBeInTheDocument();
    });
  });

  it("sets consent to false and the cookie expiry date if disagree button pressed", async () => {
    const mockSetCookie = jest.fn();
    jest
      .spyOn(cookies, "useCookies")
      .mockImplementation(() => [{}, mockSetCookie]);

    const { getByRole, getByLabelText } = render(<CookieBanner />);

    const disagreeButton = getByRole("button", {
      name: "Do not use analytics cookies",
    });
    userEvent.click(disagreeButton);

    await waitFor(() => {
      expect(mockSetCookie).toBeCalledWith("nhsuk-cookie-consent", "false", {
        expires: new Date(2021, 2, 8, 10, 30),
      });

      const confirmationBanner = getByLabelText(
        "Cookie setting success banner"
      );
      expect(confirmationBanner).toBeInTheDocument();
    });
  });

  it("navigates to cookies policy page when read more link is clicked", () => {
    jest.spyOn(cookies, "useCookies").mockImplementation(() => [{}, () => {}]);

    const { getByRole } = render(<CookieBanner />);

    const cookiePageLink = getByRole("link", {
      name: "read more about our cookies",
    });

    expect(cookiePageLink.getAttribute("href")).toBe("/cookies-policy");
  });

  it("navigates to cookies policy page when cookies page link is clicked", () => {
    jest.spyOn(cookies, "useCookies").mockImplementation(() => [{}, () => {}]);

    const { getByRole } = render(<CookieBanner />);

    const agreeButton = getByRole("button", {
      name: "I'm OK with analytics cookies",
    });
    userEvent.click(agreeButton);

    const cookiePageLink = getByRole("link", {
      name: "read more about our cookies",
    });

    expect(cookiePageLink.getAttribute("href")).toBe("/cookies-policy");
  });
});
