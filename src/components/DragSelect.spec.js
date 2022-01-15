/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/svelte";
import DragSelect from "./DragSelect.svelte";

import "@testing-library/jest-dom/extend-expect";

describe("drag select component", () => {
  it("should render component", async () => {
    const { container, getByTestId } = render(DragSelect, {
      options: [
        { value: 1, name: "by name" },
        { value: 2, name: "by value" },
        { value: 3, name: "by key" },
      ],
      value: 1,
    });

    const input = getByTestId("select");

    expect(container).toContainHTML("select");
    expect(container).toContainHTML("by name");
    expect(input.value).toEqual("1");
  });
});
