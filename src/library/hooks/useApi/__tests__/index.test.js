import { renderHook } from "@testing-library/react-hooks";
import moxios from "moxios";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";
import { useApi } from "../index";

describe("useApi", () => {
  it("returns a loading state for a pending api call", async () => {
    moxios.install();
    mockAPIResponse();

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi("http://test.com/")
    );
    const isLoading = result.current[0];
    expect(isLoading).toBeTruthy();

    await waitForNextUpdate();
    moxios.uninstall();
  });

  it("returns mock on a successful api call", async () => {
    moxios.install();
    const odsCode = "B86030";
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder({ odsCode });
    mockAPIResponse(statusCode, mockedResponse);

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(`http://test.com/${odsCode}`)
    );
    await waitForNextUpdate();

    const [isLoading, data, error] = result.current;

    expect(isLoading).toBeFalsy();
    expect(data).toEqual(mockedResponse);
    expect(error).toBeNull();
    moxios.uninstall();
  });

  it("returns an error from a failed api call", async () => {
    moxios.install();
    const statusCode = 404;
    mockAPIResponse(statusCode);

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi("http://test.com/")
    );

    await waitForNextUpdate();

    const [isLoading, data, error] = result.current;

    expect(isLoading).toBeFalsy();
    expect(data).toBeNull();
    expect(error).toBeDefined();

    moxios.uninstall();
  });
});
