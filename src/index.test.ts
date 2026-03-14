import { expect } from "jsr:@std/expect";
import app from "./index.tsx";

// Mock KV
const mockKV = {
  get: (_key: string) => {
    if (_key === "test-id") return "https://example.com";
    return null;
  },
  put: (_key: string, _value: string) => {},
};

const env = {
  VAPURL_KV: mockKV,
  API_KEY: "test-key",
};

Deno.test("GET / returns HTML", async () => {
  const res = await app.request("http://localhost/", {}, env);
  expect(res.status).toBe(200);
  const text = await res.text();
  expect(text).toContain("Vapurl");
});

Deno.test("GET /:id redirects if exists", async () => {
  const res = await app.request("http://localhost/test-id", {}, env);
  expect(res.status).toBe(302);
  expect(res.headers.get("location")).toBe("https://example.com");
});

Deno.test("GET /:id returns 404 if not exists", async () => {
  const res = await app.request("http://localhost/nonexistent", {}, env);
  expect(res.status).toBe(404);
});

Deno.test("POST /api/create creates URL", async () => {
  const res = await app.request("http://localhost/api/create", {
    method: "POST",
    headers: {
      "Authorization": "Bearer test-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: "new-id", url: "https://new.com" }),
  }, env);
  expect(res.status).toBe(200);
  const json = await res.json() as Record<string, unknown>;
  expect(json.short_url).toContain("/new-id");
});

Deno.test("POST /api/create fails with invalid auth", async () => {
  const res = await app.request("http://localhost/api/create", {
    method: "POST",
    headers: {
      "Authorization": "Bearer wrong-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: "test", url: "https://test.com" }),
  }, env);
  expect(res.status).toBe(401);
});

Deno.test("POST /api/create fails with missing fields", async () => {
  const res = await app.request("http://localhost/api/create", {
    method: "POST",
    headers: {
      "Authorization": "Bearer test-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: "" }),
  }, env);
  expect(res.status).toBe(400);
});

Deno.test("POST /api/create fails with invalid JSON", async () => {
  const res = await app.request("http://localhost/api/create", {
    method: "POST",
    headers: {
      "Authorization": "Bearer test-key",
      "Content-Type": "application/json",
    },
    body: "invalid json",
  }, env);
  expect(res.status).toBe(400);
});