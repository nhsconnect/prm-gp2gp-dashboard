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

    const { getByRole } = render(<CookieBanner />);

    const agreeButton = getByRole("button");
    userEvent.click(agreeButton);

    expect(mockSetCookie).toBeCalledWith("nhsuk-cookie-consent", "true");
  });
});
