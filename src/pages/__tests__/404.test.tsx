import React from "react";
import { render } from "@testing-library/react";
import NotFound from "../404";
import { waitFor } from "@testing-library/dom";

describe("404 NotFound Page", () => {
  it("contains the title and description metadata", async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toEqual("Page not found.");
      expect(getMeta("description")).toEqual(
        "This page may have been moved. You can find ICBs and practices using the Homepage - search."
      );
    });
  });
});

function getMeta(metaName: string) {
  //convert HTMLCollection into an array
  const metas = [...document.getElementsByTagName("meta")];
  return metas.find((meta) => meta.name === metaName)?.content || "";
}
