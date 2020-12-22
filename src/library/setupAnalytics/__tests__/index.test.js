import { setupAnalytics } from "../index";

describe("setupAnalytics", () => {
  const mockedDate = new Date("2020-12-08T11:30:00.000Z").getTime();
  const expectedAnalyticsOptions = {
    anonymize_ip: true,
    cookie_expires: 7890000,
  };
  const trackingId = "G-A7SBI1NSFJA7";

  beforeAll(() => {
    global.Date.now = jest.fn(() => mockedDate);
  });

  beforeEach(() => {
    window.dataLayer = {
      push: jest.fn(),
    };
  });

  it("sets up analytics when cookie consent is true", () => {
    const hasConsent = true;

    setupAnalytics({ hasConsent, trackingId });

    expect(window.dataLayer.push).toBeCalledTimes(2);
    expect(window.dataLayer.push).toHaveBeenCalledWith(
      expect.objectContaining(["js", new Date(mockedDate)])
    );
    expect(window.dataLayer.push).toHaveBeenCalledWith(
      expect.objectContaining(["config", trackingId, expectedAnalyticsOptions])
    );
  });

  it("does not set up analytics when cookie consent is false", () => {
    const hasConsent = false;
    setupAnalytics({ hasConsent });
    expect(window.dataLayer.push).toHaveBeenCalledTimes(0);
  });
});
