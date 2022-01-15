/**
 * @jest-environment jsdom
 */

import { render, act, fireEvent } from "@testing-library/svelte";
import Grid from "./Grid.svelte";

import "@testing-library/jest-dom/extend-expect";

describe("grid component", () => {
  it("should show nothing if items is empty", async () => {
    const { container } = render(Grid, { items: [] });
    expect(container).not.toContainHTML('class="container"');
  });

  it("should render component", async () => {
    const { container } = render(Grid, {
      items: [
        { key: 1, name: "by name" },
        { key: 2, name: "by value" },
        { key: 3, name: "by key" },
      ],
    });
    expect(container).toContainHTML("")
  });

  it("should zoom out on scroll down", async () => {
    const { container } = render(Grid, {
      items: [
        { key: 1, name: "by name" },
        { key: 2, name: "by value" },
        { key: 3, name: "by key" },
      ],
      xsize: 500,
      ysize: 500,
    });
    expect(container).toContainHTML('style="height: 500px; width: 500px;"');
    const c = container.getElementsByClassName("container")[0];
    await fireEvent.wheel(c, { deltaY: 100, ctrlKey: true });
    await act();
    await act();
    await act();
    await act();
    expect(container).toContainHTML('style="height: 50px; width: 50px;"');
  });

  it("should zoom in on scroll up", async () => {
    const { container } = render(Grid, {
      items: [
        { key: 1, name: "by name" },
        { key: 2, name: "by value" },
        { key: 3, name: "by key" },
      ],
      xsize: 500,
      ysize: 500,
    });
    expect(container).toContainHTML('style="height: 500px; width: 500px;"');
    const c = container.getElementsByClassName("container")[0];
    await fireEvent.wheel(c, { deltaY: -10, ctrlKey: true });
    expect(container).toContainHTML('style="height: 750px; width: 750px;"');
  });
});
