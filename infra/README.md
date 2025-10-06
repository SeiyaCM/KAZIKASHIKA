# Infrastructure

KAZIKASHIKAのAWSインフラストラクチャをAWS CDKで管理します。

## 技術スタック

- AWS CDK 2.x
- TypeScript 5.x

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### AWS認証情報の設定

AWS CLIを使用して認証情報を設定してください。

```bash
aws configure
```

## CDKコマンド

### ビルド

```bash
npm run build
```

### スタックのシンセサイズ

```bash
npm run synth
```

### スタックの差分確認

```bash
npm run diff
```

### デプロイ

```bash
# 全スタックをデプロイ
npm run deploy

# バックエンドのみデプロイ
npm run deploy:backend

# フロントエンドのみデプロイ
npm run deploy:frontend
```

### スタックの削除

```bash
npm run destroy
```

## スタック構成

### CognitoStack
Amazon Cognito User Poolsを作成します。

### DatabaseStack
VPCとAmazon RDS (PostgreSQL)を作成します。

### BackendStack
AWS Lambda + API GatewayでバックエンドAPIをホスティングします。

### FrontendStack
Amazon S3 + CloudFrontでフロントエンドをホスティングします。

## プロジェクト構造

```
infra/
├── bin/
│   └── app.ts                # CDKアプリエントリーポイント
├── lib/
│   ├── cognito-stack.ts      # Cognito User Pool
│   ├── database-stack.ts     # VPC + RDS
│   ├── backend-stack.ts      # Lambda + API Gateway
│   └── frontend-stack.ts     # S3 + CloudFront
└── cdk.json                  # CDK設定
```

## コスト見積もり

初期段階（無料枠利用時）: 月額 $1〜$3
無料枠終了後: 月額 $20〜$30

詳細は[設計書](../docs/architecture.md)を参照してください。

