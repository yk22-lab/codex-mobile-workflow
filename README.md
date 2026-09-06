# ベビーチェア選びテスト

暮らしの条件から、ベビーチェア選びで優先したいことを60秒で整理する公開LPです。

## スマホでの作業フロー

1. ChatGPTのCodexでこのリポジトリを選び、目的と完成条件を伝える。
2. Codexが変更・テスト・Pull Requestを作成する。
3. GitHubアプリで差分とChecksを確認する。
4. プレビューURLをスマホで開き、問題なければPRをマージする。

## 安全ルール

- APIキー、トークン、パスワード、`.env`、個人情報は置かない。
- 実際の設定値はホスティング先の秘密設定に登録する。
- 詳細は [SECURITY.md](SECURITY.md) と [AGENTS.md](AGENTS.md) を参照する。

## 開発

必要環境: Node.js 22以上

```bash
npm install
npm run dev
npm run lint
npm test
```

`npm test` はビルドと、LPの基本表示を確認します。
