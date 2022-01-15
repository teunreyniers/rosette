/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/svelte";
import App from "./App.svelte";
import { init, addMessages } from "svelte-i18n";
import enUS from "./lang/en-US.json";

describe("InfoPopup component", () => {
  addMessages("en-US", enUS);
  init({
    fallbackLocale: "en-US",
  });

  it("should render", () => {
    const { container } = render(App);
    expect(container).toContainHTML("rosette");
  });
});
