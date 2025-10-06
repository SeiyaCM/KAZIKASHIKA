# Frontend

KAZIKASHIKAのフロントエンドWebアプリケーションです。

## 技術スタック

- React 18.x
- TypeScript 5.x
- Vite 6.x
- tRPC (API通信)
- TanStack Query (サーバー状態管理)
- Zustand (クライアント状態管理)
- Tailwind CSS + shadcn/ui (UI)
- AWS Amplify (認証)

## セットアップ

### 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集して、必要な環境変数を設定してください。

### 依存関係のインストール

```bash
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:5173` で起動します。

### ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに生成されます。

### プレビュー

```bash
npm run preview
```

### テスト

```bash
# テストの実行
npm run test

# カバレッジ付きテスト
npm run test:coverage
```

### Lint & Format

```bash
# Lint
npm run lint

# Format
npm run format
```

## プロジェクト構造

```
frontend/
├── src/
│   ├── app/
│   │   ├── main.tsx          # エントリーポイント
│   │   ├── App.tsx           # ルートコンポーネント
│   │   ├── routes.tsx        # ルーティング設定
│   │   └── providers.tsx     # Providerラッパー
│   ├── components/
│   │   ├── ui/               # shadcn/uiコンポーネント
│   │   └── layout/           # レイアウトコンポーネント
│   ├── features/             # 機能別ディレクトリ
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── chores/
│   │   ├── logs/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── trpc.ts           # tRPCクライアント
│   │   ├── amplify.ts        # Amplify設定
│   │   └── utils.ts          # ユーティリティ
│   ├── hooks/                # 共通hooks
│   ├── types/                # 型定義
│   └── stores/               # Zustand状態管理
├── tests/
│   ├── unit/
│   └── e2e/
└── public/                   # 静的ファイル
```

## 環境変数

| 変数名 | 説明 | 例 |
|-------|------|-----|
| VITE_API_URL | バックエンドAPI URL | `http://localhost:3000/trpc` |
| VITE_COGNITO_USER_POOL_ID | Cognito User Pool ID | `ap-northeast-1_xxxxxxxxx` |
| VITE_COGNITO_CLIENT_ID | Cognito Client ID | `xxxxxxxxxxxxxxxxxxxxxxxxxx` |

## アーキテクチャ

このプロジェクトは [bulletproof-react](https://github.com/alan2207/bulletproof-react) のアーキテクチャパターンを採用しています。

- **機能別ディレクトリ構造**: 各機能を独立したディレクトリで管理
- **責務の分離**: コンポーネント、hooks、型定義を明確に分離
- **再利用性**: 共通コンポーネントとhooksで再利用性を向上

