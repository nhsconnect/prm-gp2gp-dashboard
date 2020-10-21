import { renderHook } from "@testing-library/react-hooks";
import { useFeatureToggle } from "../index";

jest.mock("../../../../../flags.json", () => ({
  F_NEW_FEATURE: { dev: true, prod: false },
  F_SECOND_FEATURE: { dev: false, prod: true },
}));

describe("useFeatureToggle", () => {
  const ORIGINAL_LOCATION = global.window.location;

  beforeEach(() => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      hostname: "localhost",
      search: "",
    };
  });

  afterAll(() => {
    global.window.location = ORIGINAL_LOCATION;
  });

  describe("configuration from flags.json", () => {
    it("returns false when feature flag is not in flags.json", async () => {
      const { result } = renderHook(() =>
        useFeatureToggle("NOT_PRESENT_FEATURE")
      );
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(false);
    });
    it("returns true when requesting enabled toggle in dev environment", async () => {
      const { result } = renderHook(() => useFeatureToggle("F_NEW_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(true);
    });

    it("returns false when requesting disabled toggle in dev environment", async () => {
      const { result } = renderHook(() => useFeatureToggle("F_SECOND_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(false);
    });

    it("returns false when requesting feature enabled in dev but disabled in prod", async () => {
      global.window.location.hostname =
        "prm-gp2gp-dashboard-dev.s3-website.eu-west-2.amazonaws.com";
      const { result } = renderHook(() => useFeatureToggle("F_NEW_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(false);
    });

    it("returns true when requesting feature enabled in prod but disabled in dev", async () => {
      global.window.location.hostname =
        "prm-gp2gp-dashboard-dev.s3-website.eu-west-2.amazonaws.com";
      const { result } = renderHook(() => useFeatureToggle("F_SECOND_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(true);
    });
  });

  describe("URL parameter overrides", () => {
    it("returns false when the URL parameter overrides the file configuration", async () => {
      global.window.location.search = "?f_new_feature=false";
      const { result } = renderHook(() => useFeatureToggle("F_NEW_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(false);
    });

    it("returns true when the URL parameter overrides the file configuration", async () => {
      global.window.location.search = "?f_second_feature=true";
      const { result } = renderHook(() => useFeatureToggle("F_SECOND_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(true);
    });

    it("returns true when the URL parameter matches the file configuration", async () => {
      global.window.location.search = "?f_new_feature=true";
      const { result } = renderHook(() => useFeatureToggle("F_NEW_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(true);
    });

    it("returns false when the URL parameter matches the file configuration", async () => {
      global.window.location.search = "?f_second_feature=false";
      const { result } = renderHook(() => useFeatureToggle("F_SECOND_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(false);
    });

    it("returns false when the URL parameter is true but in prod environment", async () => {
      global.window.location.hostname =
        "prm-gp2gp-dashboard-dev.s3-website.eu-west-2.amazonaws.com";
      global.window.location.search = "?f_new_feature=true";
      const { result } = renderHook(() => useFeatureToggle("F_NEW_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(false);
    });

    it("returns true when the URL parameter is uppercase", async () => {
      global.window.location.search = "?F_SECOND_FEATURE=true";
      const { result } = renderHook(() => useFeatureToggle("F_SECOND_FEATURE"));
      const isNewFeatureEnabled = result.current;
      expect(isNewFeatureEnabled).toBe(true);
    });
  });
});
