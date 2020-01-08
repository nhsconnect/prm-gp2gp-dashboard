import React from "react";
import { render } from "@testing-library/react";
import NotFound from "../404";

describe("404 page", () => {
  it("contains a title and a text paragraph", () => {
    const title = "Not found";
    const text = "If you entered a web address please check it was correct.";
    const data = {
      allFile: {
        edges: [
          {
            node: {
              childDataJson: {
                title,
                text,
              },
            },
          },
        ],
      },
    };

    const { getByText } = render(<NotFound data={data} />);

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
  });
});
