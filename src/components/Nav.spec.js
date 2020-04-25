import { render, fireEvent, act } from "@testing-library/svelte";
import Nav from "./Nav.svelte";
import { init, addMessages } from "svelte-i18n";
import enUS from "../lang/en-US.json";
import { getMessageFormatter } from "svelte-i18n";

const getMessage = (name) => getMessageFormatter(name, "en-US").format();

describe("Nav component", () => {
  addMessages("en-US", enUS);
  init({
    fallbackLocale: "en-US",
  });

  it("should render component correctly", () => {
    const { container } = render(Nav);

    expect(container).toContainHTML("Github");
    expect(container).toContainHTML("rosette");
    expect(container).toContainHTML(getMessage("about"));
    expect(container).toContainHTML(getMessage("privacy"));
    expect(container).toContainHTML("en-US");
  });

  it("should render about if clicked and close", async () => {
    const { container, getByText, getByTestId } = render(Nav);

    const aboutlink = getByText(getMessage("about"));
    await fireEvent.click(aboutlink);
    expect(container).toContainHTML(`<h1>${getMessage("about")}</h1>`);

    const close = getByTestId("close-button");
    await fireEvent.click(close);
    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));
    expect(container).not.toContainHTML(`<h1>${getMessage("about")}</h1>`);
  });

  it("should render privacy if clicked and close", async () => {
    const { container, getByText, getByTestId } = render(Nav);

    const aboutlink = getByText(getMessage("privacy"));
    await fireEvent.click(aboutlink);
    expect(container).toContainHTML(`<h1>${getMessage("privacy")}</h1>`);

    const close = getByTestId("close-button");
    await fireEvent.click(close);
    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));
    expect(container).not.toContainHTML(`<h1>${getMessage("privacy")}</h1>`);
  });
});
