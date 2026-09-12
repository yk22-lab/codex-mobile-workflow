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
  assert.match(staticPage, /hb\.afl\.rakuten\.co\.jp\/ichiba\/5770ca68/);
  assert.match(staticPage, /class="btn yahoo"/);
  assert.match(staticPage, /class="btn rakuten"/);
  assert.match(staticPage, /\.btn\.rakuten\{[^}]*background:#c92f65[^}]*color:#fff/);
  assert.match(staticPage, /\.final\{[^}]*background:linear-gradient\(135deg,#382a25 0%,#4b2d32 100%\)[^}]*color:#fff/);
  assert.match(staticPage, /\.btn\.amazon\{/);
  assert.match(staticPage, /data-lucide="external-link" class="icon" aria-hidden="true"/);
  assert.match(staticPage, /https:\/\/amzn\.to\/4A9SMyM/);
  assert.match(staticPage, /https:\/\/amzn\.to\/4xEJV5T/);
  assert.match(staticPage, /5770fefc\.dd9b7f9d/);
  assert.match(staticPage, /57710043\.6021e749/);
  assert.match(staticPage, /ユラリズム スマート プレミアム公式/);
  assert.match(staticPage, /ウイズ ラブ ベージュ（品番：2109080）/);
  assert.doesNotMatch(staticPage, /href="https:\/\/item\.rakuten\.co\.jp\/toysrus\/10058581/);
  assert.match(staticPage, /ネムリラ Fit AQ/);
  assert.match(staticPage, /5段階・ステップ連動/);
  assert.match(staticPage, /4輪すべてが自在に動く仕様が理想/);
  assert.match(staticPage, /価格とポイント還元/);
  assert.match(staticPage, /Amazonのらくベビーを使って購入したい/);
  assert.match(staticPage, /条件が合う人には、ネムリラ CRがいちばんバランス/);
  assert.doesNotMatch(staticPage, /手動CR/);
  assert.match(staticPage, /自宅へ戻ってから日常的に使い続けています/);
  assert.match(staticPage, /このレビューの使用条件/);
  assert.match(staticPage, /購入前に知っておきたい短所/);
  assert.match(staticPage, /0歳児を育てる父親/);
  assert.match(staticPage, /ネムリラ CR公式/);
  assert.match(staticPage, /購入価格は変わりません/);
  assert.doesNotMatch(staticPage, /2週間/);
  assert.match(staticPage, /寝かしつけとぐずり対策/);
  assert.match(staticPage, /Amazonで価格を見る/);
  assert.match(staticPage, /assets\/owner-photos\/nemulila-cr-hero-privacy\.webp/);
  assert.match(staticPage, /assets\/owner-photos\/nemulila-cr-everyday-position-refined-v2\.webp/);
  assert.match(staticPage, /assets\/owner-photos\/nemulila-cr-recline-lever-back\.webp/);
  assert.match(staticPage, /側面のレバーは高さ調節用/);
  assert.match(staticPage, /リクライニングレバーは背面中央/);
  assert.doesNotMatch(staticPage, /リクライニングは側面から/);
  assert.match(staticPage, /class="final-grid"/);
  assert.match(staticPage, /class="final-photo"/);
  assert.match(staticPage, /わが家で実際に使っているネムリラ CR/);
  assert.match(staticPage, /購入者が撮影したネムリラ CRの写真/);
  assert.match(staticPage, /og\.png/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
