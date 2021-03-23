import React from "react";
import { render, waitFor } from "@testing-library/react";
import {
  useFeatureToggles,
  FeatureTogglesContext,
  useFetchFeatureToggles,
  FeatureTogglesType,
} from "..";

function Features() {
  const { newFeature, secondNewFeature } = useFeatureToggles();

  return (
    <>
      {newFeature && <p>New Feature</p>}
      {secondNewFeature && <p>Second Feature</p>}
    </>
  );
}

function FeatureTogglesReadFromFile() {
  const { toggles, isLoadingToggles } = useFetchFeatureToggles();
  if (isLoadingToggles) return <p>Test loading text</p>;
  return (
    <FeatureTogglesContext.Provider value={toggles}>
      <Features />
    </FeatureTogglesContext.Provider>
  );
}

function renderFeatureTogglesReadFromFile() {
  return render(<FeatureTogglesReadFromFile />);
}

function renderFeatureToggle(toggles: FeatureTogglesType) {
  return render(
    <FeatureTogglesContext.Provider value={toggles}>
      <Features />
    </FeatureTogglesContext.Provider>
  );
}

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
        expect(getByText("Second Feature")).toBeInTheDocument();
        expect(queryByText("New Feature")).not.toBeInTheDocument();
      });
    });

    it("displays some Loading text before reading JSON file", async () => {
      const { getByText, queryByText } = renderFeatureTogglesReadFromFile();
      expect(getByText("Test loading text")).toBeInTheDocument();
      await waitFor(() => {
        expect(queryByText("Test loading text")).not.toBeInTheDocument();
        expect(getByText("New Feature")).toBeInTheDocument();
      });
    });
  });

  describe("URL query parameter overrides", () => {
    it("displays Second Feature when URL parameter overrides file config in dev", async () => {
      global.window.location.search = "?secondnewfeature=true";
      const { getByText } = renderFeatureTogglesReadFromFile();

      await waitFor(() => {
        expect(getByText("Second Feature")).toBeInTheDocument();
      });
    });

    it("displays Second Feature when uppercase URL parameter overrides file config in dev", async () => {
      global.window.location.search = "?SECONDNEWFEATURE=TRUE";
      const { getByText } = renderFeatureTogglesReadFromFile();

      await waitFor(() => {
        expect(getByText("Second Feature")).toBeInTheDocument();
      });
    });

    it("does not display New Feature when URL parameter overrides file config in dev", async () => {
      global.window.location.search = "?newFeature=false";

      const { queryByText } = renderFeatureTogglesReadFromFile();

      await waitFor(() => {
        expect(queryByText("Test loading text")).not.toBeInTheDocument();
        expect(queryByText("New Feature")).not.toBeInTheDocument();
      });
    });

    it("displays New Feature when URL parameter matches file config in dev", async () => {
      global.window.location.search = "?newFeature=true";
      const { getByText } = renderFeatureTogglesReadFromFile();

      await waitFor(() => {
        expect(getByText("New Feature")).toBeInTheDocument();
      });
    });

    it("overrides file config when there are multiple URL params in dev", async () => {
      global.window.location.search = "?newFeature=false&secondnewfeature=true";
      const { getByText, queryByText } = renderFeatureTogglesReadFromFile();

      await waitFor(() => {
        expect(getByText("Second Feature")).toBeInTheDocument();
        expect(queryByText("New Feature")).not.toBeInTheDocument();
      });
    });

    it("does not display Second Feature when URL parameter matches the file config in dev", async () => {
      global.window.location.search = "?secondnewfeature=false";
      const { queryByText } = renderFeatureTogglesReadFromFile();

      await waitFor(() => {
        expect(queryByText("Test loading text")).not.toBeInTheDocument();
        expect(queryByText("Second Feature")).not.toBeInTheDocument();
      });
    });

    it("displays Second Feature despite URL parameter override when in prod", async () => {
      process.env.GATSBY_ENV = "prod";
      global.window.location.search = "?secondnewfeature=false";
      const { getByText } = renderFeatureTogglesReadFromFile();

      await waitFor(() => {
        expect(getByText("Second Feature")).toBeInTheDocument();
      });
    });
  });
});
