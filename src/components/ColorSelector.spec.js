/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/svelte";
import ColorSelector from "./ColorSelector.svelte";

import "@testing-library/jest-dom/extend-expect";

describe("Color selector component", () => {
  it("should render component", () => {
    const { container } = render(ColorSelector, {
      props: { color: "#45df56", key: "mykey" },
    });

    expect(container).toContainHTML('<div class="container');
  });
});
