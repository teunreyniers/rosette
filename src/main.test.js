/**
 * @jest-environment jsdom
 */

 import App from "./App.svelte";
import app from "./main";

test("get app", () => {
  expect(app).toBeInstanceOf(App);
});
