# Backend

KAZIKASHIKAのバックエンドAPIサーバーです。

## 技術スタック

- Express 4.x
- TypeScript 5.x
- tRPC 10.x
- Prisma 5.x (ORM)
- PostgreSQL 15.x
- aws-jwt-verify (Cognito JWT検証)

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

### Prismaのセットアップ

```bash
# Prismaクライアントの生成
npm run prisma:generate

# データベースマイグレーション
npm run prisma:migrate

# Prisma Studioの起動（データベースGUI）
npm run prisma:studio
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
npm run build
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
backend/
├── src/
│   ├── index.ts              # エントリーポイント
│   ├── trpc/
│   │   ├── context.ts        # tRPCコンテキスト
│   │   ├── trpc.ts           # tRPC初期化
│   │   ├── router.ts         # ルートルーター
│   │   └── routers/          # 機能別ルーター
│   ├── services/             # ビジネスロジック
│   ├── utils/                # ユーティリティ
│   └── middleware/           # ミドルウェア
├── prisma/
│   ├── schema.prisma         # Prismaスキーマ
│   ├── seed.ts               # シードデータ
│   └── migrations/           # マイグレーション
└── tests/
    ├── unit/                 # ユニットテスト
    └── integration/          # 統合テスト
```

## 環境変数

| 変数名 | 説明 | 例 |
|-------|------|-----|
| DATABASE_URL | PostgreSQL接続URL | `postgresql://user:pass@localhost:5432/db` |
| COGNITO_USER_POOL_ID | Cognito User Pool ID | `ap-northeast-1_xxxxxxxxx` |
| COGNITO_CLIENT_ID | Cognito Client ID | `xxxxxxxxxxxxxxxxxxxxxxxxxx` |
| PORT | サーバーポート | `3000` |
| NODE_ENV | 環境 | `development` / `production` |

