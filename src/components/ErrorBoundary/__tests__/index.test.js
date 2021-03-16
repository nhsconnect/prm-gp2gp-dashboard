import React from "react";
import { render } from "@testing-library/react";
import { ErrorBoundary } from "../";

describe("ErrorBoundary", () => {
  it('renders "Oops, something went wrong." when an error is thrown', () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});

    const Throw = () => {
      throw new Error("unexpected error");
    };

    const { getByText } = render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    );

    expect(getByText("Oops, something went wrong.")).toBeDefined();

    spy.mockRestore();
  });

  it("calls console.error with error when an error is thrown", () => {
    const spy = jest.spyOn(console, "error");
    const error = new Error("unexpected error");
    spy.mockImplementation(() => {});

    const Throw = () => {
      throw error;
    };

    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalledWith(expect.objectContaining(error));

    spy.mockRestore();
  });
});
