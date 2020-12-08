import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as cookies from "react-cookie";
import CookieBanner from "../index";

jest.mock("react-cookie", () => ({
  useCookies: jest.fn(),
}));

describe("CookieBanner component", () => {
  it("displays cookie banner if cookies are not set", () => {
    jest.spyOn(cookies, "useCookies").mockImplementation(() => [{}, () => {}]);

    const { getByLabelText } = render(<CookieBanner />);

    expect(getByLabelText("Accept cookies")).toBeInTheDocument();
  });

  it("does not display cookie banner if cookies are set", () => {
    jest
      .spyOn(cookies, "useCookies")
      .mockImplementation(() => [{ "nhsuk-cookie-consent": "true" }, () => {}]);

    const { queryByLabelText } = render(<CookieBanner />);

    expect(queryByLabelText("Accept cookies")).not.toBeInTheDocument();
  });

  it("sets consent to true if agree button pressed", () => {
    const mockSetCookie = jest.fn();
    jest
      .spyOn(cookies, "useCookies")
      .mockImplementation(() => [{}, mockSetCookie]);

    const { getByRole, getByLabelText } = render(<CookieBanner />);

    const agreeButton = getByRole("button", {
      name: "I'm OK with analytics cookies",
    });
    userEvent.click(agreeButton);

    expect(mockSetCookie).toBeCalledWith("nhsuk-cookie-consent", "true");

    const confirmationBanner = getByLabelText("Cookie setting success");
    expect(confirmationBanner).toBeInTheDocument();
  });

  it("sets consent to false if disagree button pressed", () => {
    const mockSetCookie = jest.fn();
    jest
      .spyOn(cookies, "useCookies")
      .mockImplementation(() => [{}, mockSetCookie]);

    const { getByRole, getByLabelText } = render(<CookieBanner />);

    const disagreeButton = getByRole("button", {
      name: "Do not use analytics cookies",
    });
    userEvent.click(disagreeButton);

    expect(mockSetCookie).toBeCalledWith("nhsuk-cookie-consent", "false");

    const confirmationBanner = getByLabelText("Cookie setting success");
    expect(confirmationBanner).toBeInTheDocument();
  });
});
