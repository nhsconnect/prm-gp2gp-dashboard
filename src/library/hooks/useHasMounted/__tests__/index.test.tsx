import React from "react";

import { useHasMounted } from "..";
import { render } from "@testing-library/react";

function TestComponent() {
  const { hasMounted } = useHasMounted();
  return <>{hasMounted && <p>Has mounted component</p>}</>;
}

describe("useHasMounted", () => {
  it("it will display text when component has mounted", () => {
    const { queryByText } = render(<TestComponent />);
    expect(queryByText("Has mounted component")).toBeInTheDocument();
  });
});
