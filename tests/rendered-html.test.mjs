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
  assert.match(layout, /title:\s*"ネムリラ CR・Fit AQ・ユラリズム比較｜実使用レビュー"/);
  assert.match(staticPage, /手動ハイローチェア3台を比較して/);
  assert.match(staticPage, /コンビ ネムリラ CR/);
  assert.match(staticPage, /一番感動したのは、スイングでした/);
  assert.match(staticPage, /おしゃぶりと合わせるとそのまま眠ることも/);
  assert.match(staticPage, /購入前に比べた3台/);
  assert.match(staticPage, /class="compare"/);
  assert.match(staticPage, /楽天市場で見る/);
  assert.match(staticPage, /ネムリラ Fit AQ/);
  assert.match(staticPage, /5段階・ステップ連動/);
  assert.match(staticPage, /4輪すべてが自在に動く仕様が理想/);
  assert.match(staticPage, /価格とポイント還元/);
  assert.match(staticPage, /Amazonのらくベビーを使って購入したい/);
  assert.match(staticPage, /条件が合う人には、CRがいちばんバランス/);
  assert.match(staticPage, /2週間、使わない日はありません/);
  assert.match(staticPage, /寝かしつけとぐずり対策/);
  assert.match(staticPage, /商品詳細を見る/);
  assert.match(staticPage, /assets\/soothe-flat\.png/);
  assert.match(staticPage, /og\.png/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
