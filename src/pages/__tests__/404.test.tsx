import React from "react";
import { render } from "@testing-library/react";
import Index from "../index";
import NotFound from "../404";
import { waitFor } from "@testing-library/dom";

describe("404 NotFound Page", () => {
  it("contains the title and description metadata", async () => {
    const { getByRole } = render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toEqual("Page not found.");
      expect(getMeta("description")).toEqual(
        "The page you are looking for on GP Registrations Data cannot be found."
      );
    });
  });

  function getMeta(metaName: string) {
    const metas = document.getElementsByTagName("meta");
    for (let i = 0; i < metas.length; i += 1) {
      if (metas[i].getAttribute("name") === metaName) {
        return metas[i].getAttribute("content");
      }
    }
    return "";
  }
});
