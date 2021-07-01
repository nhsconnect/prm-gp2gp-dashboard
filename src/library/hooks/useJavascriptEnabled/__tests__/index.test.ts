import { renderHook } from "@testing-library/react-hooks";
import { useJavascriptEnabled } from "../index";

describe("useJavascriptEnabled", () => {
  it("returns true when javascript is enabled", () => {
    const { result } = renderHook(() => useJavascriptEnabled());
    const { hasJavascriptEnabled } = result.current;

    expect(hasJavascriptEnabled).toBeTruthy();
  });
});
