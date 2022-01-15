/**
 * @jest-environment jsdom
 */

import { findParent, findNodeIndex } from "./nodes";

describe("function findParent", () => {
  it("should return a parent of an element of a given type", () => {
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const ul = document.createElement("ul");
    const li1 = document.createElement("li");
    const li2 = document.createElement("li");

    ul.appendChild(li1);
    ul.appendChild(li2);
    div1.appendChild(ul);
    div2.appendChild(div1);

    const parent = findParent(li2, "div");

    expect(parent === div1).toBe(true);
  });
});

describe("function findNodeIndex", () => {
  it("should return the index of a node in the childnodes of its parent", () => {
    const ul = document.createElement("ul");
    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    const li3 = document.createElement("li");
    const li4 = document.createElement("li");

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    const index = findNodeIndex(li3);

    expect(index).toBe(2);
  });
});
