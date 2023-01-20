import { renderHook } from "@testing-library/react";
import moxios from "moxios";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";
import { useApi } from "../index";
import {waitFor} from "@testing-library/dom";

describe("useApi", () => {
  beforeAll(() => {
    moxios.install();
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it("returns a loading state for a pending api call", async () => {
    mockAPIResponse();

    const { result } = renderHook(() =>
      useApi("http://test.com/")
    );
    expect(result.current.isLoading).toBeTruthy();

	await waitFor(() => {})
  });

  it("returns mock on a successful api call", async () => {
    const odsCode = "B86030";
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder();
    mockAPIResponse(statusCode, mockedResponse);

    const { result } = renderHook(() =>
      useApi(`http://test.com/${odsCode}`)
    );
	await waitFor(() => {})

    const { isLoading, data, error } = result.current;

    expect(isLoading).toBeFalsy();
    expect(data).toEqual(mockedResponse);
    expect(error).toBeNull();
  });

  it("returns an error from a failed api call", async () => {
    const statusCode = 404;
    mockAPIResponse(statusCode);

    const { result } = renderHook(() =>
      useApi("http://test.com/")
    );

	await waitFor(() => {})

    const { isLoading, data, error } = result.current;

    expect(isLoading).toBeFalsy();
    expect(data).toBeNull();
    expect(error).toBeDefined();
  });
});
