import { expect } from "jsr:@std/expect";
import { render } from "@testing-library/react";
import { JSDOM } from "jsdom";
import App from "./app.tsx";

// Setup JSDOM
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
});
globalThis.window = dom.window as Window & typeof globalThis;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;

Deno.test("App renders correctly", () => {
  const { container } = render(<App />);
  expect(container.textContent).toContain("API Key");
});