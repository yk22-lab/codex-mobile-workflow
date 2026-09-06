"use client";

import { useState } from "react";

type Answer = "space" | "clean" | "long" | null;

const choices = [
  { id: "space" as const, eyebrow: "置き場所", title: "部屋を広く使いたい", body: "使わない時間にしまえるか、圧迫感が少ないかを重視。" },
  { id: "clean" as const, eyebrow: "毎日のこと", title: "掃除をラクにしたい", body: "食べこぼしを拭きやすいか、布製パーツが少ないかを重視。" },
  { id: "long" as const, eyebrow: "これから", title: "長く使いたい", body: "座面や足置きを調整できるか、成長後も使えるかを重視。" },
];

const results = {
  space: {
    label: "コンパクト重視タイプ",
    title: "まずは、置きっぱなしにしない前提で選ぶ。",
    text: "食事のたびに出し入れするなら、折りたたみや移動のしやすさが、毎日の満足度を左右します。",
    checks: ["畳んだときの奥行き", "テーブル周りで動かせるか", "床を傷つけにくいか"],
  },
  clean: {
    label: "お手入れ重視タイプ",
    title: "まずは、食後3分で戻せるかを考える。",
    text: "食べこぼしが入り込む隙間や、外して洗うパーツの多さを先に見ておくと、後悔が減ります。",
    checks: ["座面の隙間", "トレーの外しやすさ", "布製パーツの有無"],
  },
  long: {
    label: "長く使う重視タイプ",
    title: "まずは、成長後の姿まで想像する。",
    text: "月齢だけでなく、座面・足置きの調整幅と、大人用の椅子として残せるかを見ておくと選びやすいです。",
    checks: ["座面と足置きの調整", "耐荷重と対象年齢", "大人用としての使いやすさ"],
  },
};

export default function Home() {
  const [answer, setAnswer] = useState<Answer>(null);
  const result = answer ? results[answer] : null;

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">BABY CHAIR · CHOICE TEST</p>
          <h1>わが家に合う<br />ベビーチェアの<br /><em>優先順位</em>は？</h1>
          <p className="intro">商品名から選ぶ前に、まず暮らしの条件をひとつ決める。<br />60秒の選択テストです。</p>
          <a className="scroll-link" href="#test">選んでみる <span>↓</span></a>
        </div>
        <div className="hero-art" aria-label="木製ベビーチェアを抽象化したイラスト">
          <div className="sun" />
          <div className="chair chair-back" />
          <div className="chair chair-seat" />
          <div className="chair chair-leg left" />
          <div className="chair chair-leg right" />
          <div className="plant"><i /><i /><i /></div>
        </div>
      </section>

      <section className="test-section" id="test">
        <div className="section-head">
          <p className="kicker">QUESTION 01</p>
          <h2>今いちばん避けたいのは？</h2>
          <p>正解はひとつではありません。今の暮らしに近いものを選んでください。</p>
        </div>
        <div className="choice-grid">
          {choices.map((choice, index) => (
            <button
              className={`choice ${answer === choice.id ? "selected" : ""}`}
              key={choice.id}
              onClick={() => setAnswer(choice.id)}
              type="button"
            >
              <span className="choice-number">0{index + 1}</span>
              <span className="choice-eyebrow">{choice.eyebrow}</span>
              <strong>{choice.title}</strong>
              <small>{choice.body}</small>
              <span className="choice-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className={`result ${result ? "visible" : ""}`} aria-live="polite">
        {result ? (
          <div className="result-inner">
            <div className="result-topline"><span>YOUR GUIDE</span><span>{result.label}</span></div>
            <h2>{result.title}</h2>
            <p>{result.text}</p>
            <div className="check-list">
              <p>商品ページで見るポイント</p>
              <ol>{result.checks.map((item) => <li key={item}>{item}</li>)}</ol>
            </div>
            <button className="reset" type="button" onClick={() => setAnswer(null)}>ほかの条件で選び直す</button>
          </div>
        ) : (
          <div className="empty-result"><span>↑</span> 条件をひとつ選ぶと、見るべきポイントが出ます</div>
        )}
      </section>

      <section className="note">
        <p className="kicker">THIS IS A TEST PAGE</p>
        <p>実際のLPでは、この診断の下に「わが家が選んだ理由」と、自分で使った写真・動画を置く想定です。</p>
      </section>
    </main>
  );
}
