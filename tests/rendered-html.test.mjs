import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the baby chair choice test", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ベビーチェア選びテスト<\/title>/);
  assert.match(html, /BABY CHAIR · CHOICE TEST/);
  assert.match(html, /わが家に合う/);
  assert.match(html, /今いちばん避けたいのは？/);
  assert.match(html, /部屋を広く使いたい/);
  assert.match(html, /掃除をラクにしたい/);
  assert.match(html, /長く使いたい/);
  assert.match(html, /条件をひとつ選ぶと、見るべきポイントが出ます/);
});

test("keeps the published page free from starter preview code", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const choices/);
  assert.match(page, /const results/);
  assert.match(page, /aria-live="polite"/);
  assert.match(layout, /title:\s*"ベビーチェア選びテスト"/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
