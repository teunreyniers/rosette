import { render, fireEvent, act } from "@testing-library/svelte";
import Collapsible from "./Collapsible.svelte";

import "@testing-library/jest-dom/extend-expect";

describe("Collapsible component", () => {
  it("should render component correctly", () => {
    const { container } = render(Collapsible, {
      props: { header: "Slot header" },
    });

    expect(container).toContainHTML("<h4");
    expect(container).toContainHTML("Slot header");
  });

  it("should be open by default", () => {
    const { container } = render(Collapsible, {
      props: { header: "Slot header" },
    });

    expect(container).toContainHTML("<p>Empty slot</p>");
  });

  it("should be closed if default state false", () => {
    const { container } = render(Collapsible, {
      props: {
        header: "Slot header",
        defaultState: false,
      },
    });

    expect(container).not.toContainHTML("<p>Empty slot</p>");
  });

  it("should open when the header is clicked", async () => {
    const { getByText, container } = render(Collapsible, {
      props: {
        header: "Slot header",
        defaultState: false,
      },
    });
    const header = getByText("Slot header");

    expect(container).not.toContainHTML("<p>Empty slot</p>");

    await fireEvent.click(header);
    expect(container).toContainHTML("<p>Empty slot</p>");
  });

  it("should close when the header is clicked", async () => {
    const { getByText, container } = render(Collapsible, {
      props: {
        header: "Slot header",
        defaultState: true,
      },
    });
    const header = getByText("Slot header");

    expect(container).toContainHTML("<p>Empty slot</p>");

    await fireEvent.click(header);
    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));
    expect(container).not.toContainHTML("<p>Empty slot</p>");
  });
});
