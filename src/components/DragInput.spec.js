/**
 * @jest-environment jsdom
 */

import { render, act, fireEvent } from "@testing-library/svelte";
import DragInput from "./DragInput.svelte";

import "@testing-library/jest-dom/extend-expect";

describe("drag input component", () => {
  it("should render component", async () => {
    const { container, getByTestId } = render(DragInput, { value: 25 });
    const input = getByTestId("input");

    expect(container).toContainHTML("input");
    expect(input.value).toEqual("25");
  });

  it("should reset to default if mousedown and ctrl mouseup", async () => {
    const { getByTestId, component } = render(DragInput, {
      target: window.document.body,
      props: { value: "25", defaultValue: "0" },
    });
    const input = getByTestId("input");
    let value;

    component.$on("change", (e) => {
      value = e.detail.value;
    });

    await fireEvent.mouseDown(input);
    await fireEvent.mouseUp(input, { ctrlKey: true });
    await act();
    expect(value).toEqual(0);
  });
});
