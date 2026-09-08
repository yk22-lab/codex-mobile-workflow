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

test("redirects the root page to the latest published LP", async () => {
  const response = await render();
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "/baby-chair-choice-test.html");
});

test("keeps the root route bound to the standalone latest LP", async () => {
  const [page, layout, packageJson, staticPage] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../public/baby-chair-choice-test.html", import.meta.url), "utf8"),
  ]);

  assert.match(page, /redirect\("\/baby-chair-choice-test\.html"\)/);
  assert.match(layout, /title:\s*"ベビーチェア選びテスト"/);
  assert.match(staticPage, /ハイローチェア、<em>電動か手動かだけで選んでない？<\/em>/);
  assert.match(staticPage, /コンビ ネムリラ CR/);
  assert.match(staticPage, /使い始めて2週間の実感/);
  assert.match(staticPage, /おしゃぶりと合わせると、うちの子はほぼ毎回静かになり/);
  assert.match(staticPage, /購入前に最後まで比べた3台/);
  assert.match(staticPage, /リクライニングとステップが連動する/);
  assert.match(staticPage, /使ってみて分かった、移動のこと/);
  assert.match(staticPage, /価格とポイント還元を確認してから/);
  assert.match(staticPage, /Amazonのらくベビーを使って購入できたら/);
  assert.match(staticPage, /今回の比較で、わが家の本命/);
  assert.match(staticPage, /2週間経った今、使わない日はありません/);
  assert.match(staticPage, /家事用から、寝かしつけの主力へ/);
  assert.match(staticPage, /公式の商品情報を見る/);
  assert.match(staticPage, /assets\/soothe-flat\.png/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
