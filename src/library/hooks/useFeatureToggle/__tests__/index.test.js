import { renderHook } from "@testing-library/react-hooks";
import { useFeatureToggle } from "../index";

jest.mock("../../../../../flags.json", () => ({
  F_NEW_FEATURE: { dev: true, prod: false },
  F_SECOND_FEATURE: { dev: false },
}));

describe("useFeatureToggle", () => {
  const ORIGINAL_LOCATION = global.window.location;
  beforeAll(() => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      hostname: "localhost",
    };
  });

  afterAll(() => {
    global.window.location = ORIGINAL_LOCATION;
  });

  it("returns true when requesting enabled toggle in dev environment", async () => {
    process.env = { DEPLOYMENT_ENV: "dev" };

    jest.mock(
      "flags.dev.json",
      () => ({
        F_NEW_FEATURE: true,
      }),
      { virtual: true }
    );

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
    global.window.location = {
      hostname: "prm-gp2gp-dashboard-dev.s3-website.eu-west-2.amazonaws.com",
    };

    const { result } = renderHook(() => useFeatureToggle("F_NEW_FEATURE"));

    const isNewFeatureEnabled = result.current;

    expect(isNewFeatureEnabled).toBe(false);
  });
});
