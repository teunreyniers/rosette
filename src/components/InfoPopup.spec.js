import { render, fireEvent, act } from "@testing-library/svelte";
import InfoPopup from "./InfoPopup.svelte";

describe("InfoPopup component", () => {
  it("should not render if closed", () => {
    const { container } = render(InfoPopup, {
      isOpen: false,
      header: "My Header",
    });

    expect(container).not.toContainHTML("<h1>My Header</h1>");
  });

  it("should render component correctly", () => {
    const { container } = render(InfoPopup, {
      isOpen: true,
      background: "blue",
      sidepanel: "red",
      close: "green",
      header: "My Header",
    });

    expect(container).toContainHTML("blue");
    expect(container).toContainHTML("red");
    expect(container).toContainHTML("green");
    expect(container).toContainHTML("<h1>My Header</h1>");
  });

  it("should send close event when close is clicked", async () => {
    const { getByTestId, component } = render(InfoPopup, {
      isOpen: true,
      header: "",
    });

    let eventFired;

    component.$on("close", () => {
      eventFired = true;
    });

    const close = getByTestId("close-button");
    await fireEvent.click(close);
    await act();
    expect(eventFired).toBe(true);
  });

  it("should close when is open is set to false", async () => {
    const { getByTestId, component } = render(InfoPopup, {
      isOpen: true,
      header: "",
    });

    component.$set({ isOpen: false });
    const close = getByTestId("close-button");
    await act(() => new Promise((resolve) => setTimeout(resolve, 800)));
    expect(close).not.toBeInTheDocument();
  });
});
