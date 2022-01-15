/**
 * @jest-environment jsdom
 */

import { render, fireEvent } from "@testing-library/svelte";
import LabelForm from "./LabelForm.svelte";
import { init, addMessages } from "svelte-i18n";
import enUS from "../lang/en-US.json";

describe("LabelForm component", () => {
  const label = {
    key: "__name__",
    readonly: true,
    name: "My label",
    value: "Not used",
    xpos: 0,
    ypos: -145,
    size: 18,
    weight: 600,
    angle: 0,
    anchor: "middle",
    color: "#000000",
  };

  addMessages("en-US", enUS);
  init({
    fallbackLocale: "en-US",
  });

  it("should render open", () => {
    const { container } = render(LabelForm, {
      label,
      index: 1,
      defaultState: true,
    });

    expect(container).toContainHTML("My label");
    expect(container).toContainHTML("middle");
  });

  it("should render closed", () => {
    const { container } = render(LabelForm, {
      label,
      index: 1,
      defaultState: false,
    });

    expect(container).toContainHTML("My label");
    expect(container).not.toContainHTML("#000000");
  });

  it("should dispatch event", async () => {
    // eslint-disable-next-line
    const { readonly, ...rest } = label;
    const { getByDisplayValue, component } = render(LabelForm, {
      label: { readonly: false, ...rest },
      index: 1,
      defaultState: true,
    });

    let value;
    const input = getByDisplayValue(label.value);

    component.$on("labelchange", (e) => (value = e.detail.label.value));

    await fireEvent.change(input, { target: { value: "my value" } });

    expect(value).toEqual("my value");
  });
});
