import React from "react";
import { render, waitFor } from "@testing-library/react";
import {
  useFeatureToggles,
  FeatureTogglesContext,
  useFetchFeatureToggles,
  FeatureToggles,
} from "..";

jest.mock("../../../../../featureToggles.json", () => ({
  dev: {
    newFeature: true,
    secondNewFeature: false,
  },
  prod: {
    newFeature: false,
    secondNewFeature: true,
  },
}));

describe.only("Feature Toggling Functionality", () => {
  const ORIGINAL_LOCATION = global.window.location;

  beforeEach(() => {
    // @ts-ignore
    delete global.window.location;
    global.window = Object.create(window);
    // @ts-ignore
    global.window.location = {
      hostname: "localhost",
      search: "",
    };

    process.env.GATSBY_ENV = "dev";
  });

  afterAll(() => {
    global.window.location = ORIGINAL_LOCATION;
  });

  function Features() {
    const { newFeature, secondNewFeature } = useFeatureToggles();

    return (
      <>
        {newFeature && <p>New Feature</p>}
        {secondNewFeature && <p>Second Feature</p>}
      </>
    );
  }

  function FeatureTest() {
    const { toggles, isLoadingToggles } = useFetchFeatureToggles();
    if (isLoadingToggles) return <p>Test loading text</p>;
    return (
      <FeatureTogglesContext.Provider value={toggles}>
        <Features />
      </FeatureTogglesContext.Provider>
    );
  }

  function renderFeatureTogglesReadFromFile() {
    return render(<FeatureTest />);
  }

  function renderFeatureToggle(toggles: FeatureToggles) {
    return render(
      <FeatureTogglesContext.Provider value={toggles}>
        <Features />
      </FeatureTogglesContext.Provider>
    );
  }

  describe("useFeatureToggles", () => {
    it("does not display features when no feature toggles are on", () => {
      const { queryByText } = renderFeatureToggle({});
      expect(queryByText("New Feature")).not.toBeInTheDocument();
      expect(queryByText("Second Feature")).not.toBeInTheDocument();
    });

    it("displays New Feature when that feature toggle is on", () => {
      const { queryByText, getByText } = renderFeatureToggle({
        newFeature: true,
      });
      expect(getByText("New Feature")).toBeInTheDocument();
      expect(queryByText("Second Feature")).not.toBeInTheDocument();
    });

    it("displays New Feature and Second Feature when both feature toggles are on", () => {
      const { getByText } = renderFeatureToggle({
        newFeature: true,
        secondNewFeature: true,
      });
      expect(getByText("New Feature")).toBeInTheDocument();
      expect(getByText("Second Feature")).toBeInTheDocument();
    });
  });

  describe("useFetchFeatureToggles", () => {
    it("displays New Feature when reading JSON in dev", async () => {
      const { queryByText, getByText } = renderFeatureTogglesReadFromFile();
      await waitFor(() => {
        expect(getByText("New Feature")).toBeInTheDocument();
        expect(queryByText("Second Feature")).not.toBeInTheDocument();
      });
    });

    it("displays Second New Feature when reading JSON in prod", async () => {
      process.env.GATSBY_ENV = "prod";
      const { queryByText, getByText } = renderFeatureTogglesReadFromFile();
      await waitFor(() => {
        expect(queryByText("New Feature")).not.toBeInTheDocument();
        expect(getByText("Second Feature")).toBeInTheDocument();
      });
    });

    it("displays some Loading text before reading JSON file", async () => {
      const { getByText } = renderFeatureTogglesReadFromFile();
      expect(getByText("Test loading text")).toBeInTheDocument();
      await waitFor(() => expect(getByText("New Feature")).toBeInTheDocument());
    });
  });
});
