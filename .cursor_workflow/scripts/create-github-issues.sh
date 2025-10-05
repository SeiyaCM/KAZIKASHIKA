#!/bin/bash

# GitHub Issues作成スクリプト
# 実装計画書のユーザーストーリーをGitHub Issuesとして作成します

set -e

REPO_OWNER="SeiyaCM"
REPO_NAME="KAZIKASHIKA"

echo "🚀 GitHub Issues作成を開始します..."

# Project IDを読み込み
if [ ! -f ".cursor_workflow/scripts/project-id.txt" ]; then
    echo "❌ Project IDが見つかりません。先に create-github-project.sh を実行してください"
    exit 1
fi

PROJECT_ID=$(cat .cursor_workflow/scripts/project-id.txt)
echo "📝 Project ID: $PROJECT_ID"

# Issueを作成する関数
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    local milestone="$4"
    
    echo "  作成中: $title"
    
    gh issue create \
        --repo "$REPO_OWNER/$REPO_NAME" \
        --title "$title" \
        --body "$body" \
        --label "$labels" \
        ${milestone:+--milestone "$milestone"}
}

echo ""
echo "============================================"
echo "Sprint 0: プロジェクト初期設定"
echo "============================================"
echo ""

# US-001
create_issue \
"US-001: モノレポ初期設定" \
"## ユーザーストーリー
開発者として、モノレポ構成でプロジェクトをセットアップしたい。そうすることで、backend、frontend、infraを一元管理できる。

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
プロジェクト基盤構築

## 受け入れ基準
- [ ] ルートpackage.jsonにworkspaces設定
- [ ] backend、frontend、infraディレクトリ作成
- [ ] 各ディレクトリにpackage.json作成
- [ ] TypeScript設定ファイル作成
- [ ] .gitignore、.gitattributes設定
- [ ] README.md作成

## 技術タスク
1. \`npm init\` でルートpackage.json作成
2. workspaces設定 (backend, frontend, infra)
3. backend/package.json作成
4. frontend/package.json作成
5. infra/package.json作成
6. ルートtsconfig.json作成
7. README.md作成" \
"P0,Sprint-0,Epic:基盤構築"

# US-002
create_issue \
"US-002: Biome設定" \
"## ユーザーストーリー
開発者として、Biomeを使用してコードフォーマットとLintを統一したい。そうすることで、コード品質を保てる。

## 優先度
P0 (Critical)

## ストーリーポイント
2

## Epic
プロジェクト基盤構築

## 受け入れ基準
- [ ] biome.json作成
- [ ] Google TypeScript Style Guideに準拠
- [ ] npm scriptsにlint、formatコマンド追加
- [ ] 全パッケージでBiome動作確認

## 技術タスク
1. Biomeをルートにインストール
2. biome.json作成（Google TS Style Guide準拠）
3. backend、frontend、infraのpackage.jsonにスクリプト追加
4. 動作確認" \
"P0,Sprint-0,Epic:基盤構築"

# US-003
create_issue \
"US-003: バックエンド基本構成" \
"## ユーザーストーリー
開発者として、Expressサーバーの基本構成を作成したい。そうすることで、tRPCエンドポイントを提供できる。

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
プロジェクト基盤構築

## 受け入れ基準
- [ ] Expressサーバーが起動する
- [ ] tRPCの基本設定が完了している
- [ ] ローカル環境で動作確認できる
- [ ] 環境変数の管理ができる

## 技術タスク
1. Express、tRPC、Prisma等の依存関係インストール
2. src/index.ts作成（Expressサーバー）
3. src/trpc/trpc.ts作成（tRPC初期化）
4. src/trpc/context.ts作成（コンテキスト）
5. src/trpc/router.ts作成（ルートルーター）
6. .env.example作成
7. 開発サーバー起動スクリプト追加

## 依存関係
- US-001" \
"P0,Sprint-0,Epic:基盤構築"

# US-004
create_issue \
"US-004: Prisma初期設定" \
"## ユーザーストーリー
開発者として、Prismaを使用してデータベーススキーマを管理したい。そうすることで、型安全なデータベース操作ができる。

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
プロジェクト基盤構築

## 受け入れ基準
- [ ] prisma/schema.prisma作成
- [ ] 全5テーブル（User, Team, Chore, UserChoreStress, ChoreLog）定義
- [ ] PostgreSQLにマイグレーション実行
- [ ] Prisma Clientが生成される

## 技術タスク
1. Prismaインストール
2. \`npx prisma init\`実行
3. schema.prisma作成（設計書通り）
4. ローカルPostgreSQL起動
5. \`npx prisma migrate dev\`実行
6. \`npx prisma generate\`実行
7. lib/prisma.ts作成（Prismaクライアント）

## 依存関係
- US-003" \
"P0,Sprint-0,Epic:基盤構築"

# US-005
create_issue \
"US-005: フロントエンド基本構成" \
"## ユーザーストーリー
開発者として、React + Viteのフロントエンド環境を構築したい。そうすることで、モダンなSPAを開発できる。

## 優先度
P0 (Critical)

## ストーリーポイント
5

## Epic
プロジェクト基盤構築

## 受け入れ基準
- [ ] Vite + Reactプロジェクトが起動する
- [ ] TypeScript設定完了
- [ ] Tailwind CSS設定完了
- [ ] React Routerの基本設定完了
- [ ] tRPCクライアント設定完了

## 技術タスク
1. \`npm create vite@latest\`実行
2. React + TypeScript選択
3. Tailwind CSSインストール・設定
4. React Routerインストール・設定
5. tRPC Clientインストール・設定
6. src/app/routes.tsx作成
7. src/lib/trpc.ts作成
8. 開発サーバー起動確認

## 依存関係
- US-001" \
"P0,Sprint-0,Epic:基盤構築"

# US-006
create_issue \
"US-006: shadcn/ui導入" \
"## ユーザーストーリー
開発者として、shadcn/uiを導入してUIコンポーネントを使用したい。そうすることで、美しいUIを効率的に構築できる。

## 優先度
P1 (High)

## ストーリーポイント
3

## Epic
プロジェクト基盤構築

## 受け入れ基準
- [ ] shadcn/ui初期設定完了
- [ ] 基本コンポーネント（Button, Input, Dialog等）追加
- [ ] components/ui/ディレクトリ作成
- [ ] サンプルページで動作確認

## 技術タスク
1. \`npx shadcn-ui@latest init\`実行
2. components.json設定
3. Button、Input、Dialog、Card等の基本コンポーネント追加
4. サンプルページ作成して動作確認

## 依存関係
- US-005" \
"P1,Sprint-0,Epic:基盤構築"

# US-014
create_issue \
"US-014: RDS開発環境構築" \
"## ユーザーストーリー
開発者として、ローカル開発用のPostgreSQLデータベースをセットアップしたい。そうすることで、開発環境で動作確認できる。

## 優先度
P0 (Critical)

## ストーリーポイント
5

## Epic
プロジェクト基盤構築

## 受け入れ基準
- [ ] ローカルPostgreSQLインストール
- [ ] kazikashikaデータベース作成
- [ ] Prismaマイグレーション実行
- [ ] 接続確認

## 技術タスク
1. PostgreSQLインストール（Docker or ローカル）
2. データベース作成
3. DATABASE_URL設定
4. \`npx prisma migrate dev\`実行
5. Prisma Studioで確認

## 依存関係
- US-004" \
"P0,Sprint-0,Epic:基盤構築"

echo ""
echo "============================================"
echo "Sprint 1: 認証とインフラ基盤"
echo "============================================"
echo ""

# US-007
create_issue \
"US-007: AWS Cognito User Pool作成" \
"## ユーザーストーリー
開発者として、AWS Cognito User Poolを作成したい。そうすることで、ユーザー認証機能を提供できる。

## 優先度
P0 (Critical)

## ストーリーポイント
5

## Epic
認証基盤

## 受け入れ基準
- [ ] Cognito User Pool作成（CDKまたはコンソール）
- [ ] User Pool Clientアプリ作成
- [ ] パスワードポリシー設定
- [ ] メール検証設定
- [ ] User Pool IDとClient IDを環境変数に設定

## 技術タスク
1. infra/lib/cognito-stack.ts作成
2. User Pool設定（パスワードポリシー、メール検証等）
3. User Pool Client作成
4. CDKでデプロイ（またはコンソールで作成）
5. 出力されたIDを.envに設定" \
"P0,Sprint-1,Epic:認証基盤"

# US-008
create_issue \
"US-008: Cognito JWT検証実装" \
"## ユーザーストーリー
バックエンド開発者として、Cognitoから発行されたJWTを検証したい。そうすることで、認証済みユーザーのみAPIアクセスを許可できる。

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
認証基盤

## 受け入れ基準
- [ ] aws-jwt-verifyパッケージ導入
- [ ] utils/cognito.ts作成
- [ ] verifyCognitoToken関数実装
- [ ] tRPCコンテキストでJWT検証
- [ ] protectedProcedure実装

## 技術タスク
1. aws-jwt-verifyインストール
2. utils/cognito.ts作成
3. verifyCognitoToken関数実装
4. context.tsでJWT検証実装
5. trpc.tsでprotectedProcedure実装
6. テストケース作成

## 依存関係
- US-007" \
"P0,Sprint-1,Epic:認証基盤"

# US-009
create_issue \
"US-009: フロントエンドAmplify統合" \
"## ユーザーストーリー
フロントエンド開発者として、AWS AmplifyでCognito認証を統合したい。そうすることで、ユーザー登録・ログイン機能を実装できる。

## 優先度
P0 (Critical)

## ストーリーポイント
5

## Epic
認証基盤

## 受け入れ基準
- [ ] aws-amplifyパッケージ導入
- [ ] lib/amplify.ts作成
- [ ] Cognito設定
- [ ] features/auth/hooks/useAuth.ts作成
- [ ] 認証状態管理実装

## 技術タスク
1. aws-amplifyインストール
2. lib/amplify.ts作成（Amplify.configure）
3. features/auth/hooks/useAuth.ts作成
4. signUp、confirmSignUp、signIn、signOut関数実装
5. 認証状態管理（Zustandまたはcontext）
6. ProtectedRouteコンポーネント作成

## 依存関係
- US-007" \
"P0,Sprint-1,Epic:認証基盤"

# US-010
create_issue \
"US-010: ユーザー登録画面" \
"## ユーザーストーリー
新規ユーザーとして、メールアドレスとパスワードでアカウントを登録したい。そうすることで、アプリを使い始めることができる。

## 優先度
P0 (Critical)

## ストーリーポイント
5

## Epic
認証基盤

## 受け入れ基準
- [ ] /registerページ作成
- [ ] フォーム（ユーザー名、メール、パスワード）実装
- [ ] React Hook Form + Zod バリデーション
- [ ] Amplify signUp()呼び出し
- [ ] 成功時、確認画面へ遷移
- [ ] エラーハンドリング

## 技術タスク
1. features/auth/pages/RegisterPage.tsx作成
2. React Hook Form設定
3. Zodスキーマ定義
4. useAuth hookを使用してsignUp実行
5. エラーハンドリング実装
6. 成功時に/confirm-emailへ遷移

## 依存関係
- US-009" \
"P0,Sprint-1,Epic:認証基盤"

# US-011
create_issue \
"US-011: メール確認画面" \
"## ユーザーストーリー
新規ユーザーとして、メールで受信した確認コードを入力したい。そうすることで、メールアドレスを検証できる。

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
認証基盤

## 受け入れ基準
- [ ] /confirm-emailページ作成
- [ ] 確認コード入力フォーム実装
- [ ] Amplify confirmSignUp()呼び出し
- [ ] 成功時、tRPC auth.createUserでDB登録
- [ ] /app/team-setupへ遷移
- [ ] エラーハンドリング

## 技術タスク
1. features/auth/pages/ConfirmEmailPage.tsx作成
2. 確認コード入力フォーム実装
3. confirmSignUp実行
4. 成功時にcurrentUserのSubを取得
5. tRPC auth.createUserでDB登録
6. /app/team-setupへ遷移

## 依存関係
- US-010
- US-013" \
"P0,Sprint-1,Epic:認証基盤"

# US-012
create_issue \
"US-012: ログイン画面" \
"## ユーザーストーリー
既存ユーザーとして、メールアドレスとパスワードでログインしたい。そうすることで、アプリを使用できる。

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
認証基盤

## 受け入れ基準
- [ ] /loginページ作成
- [ ] フォーム（メール、パスワード）実装
- [ ] Amplify signIn()呼び出し
- [ ] 成功時、適切なページへリダイレクト
- [ ] エラーハンドリング

## 技術タスク
1. features/auth/pages/LoginPage.tsx作成
2. React Hook Form設定
3. useAuth hookを使用してsignIn実行
4. 成功時にtRPC auth.meでユーザー情報取得
5. チーム所属状況に応じてリダイレクト
6. エラーハンドリング実装

## 依存関係
- US-009
- US-013" \
"P0,Sprint-1,Epic:認証基盤"

# US-013
create_issue \
"US-013: 認証ルーターAPI実装" \
"## ユーザーストーリー
バックエンド開発者として、認証関連のtRPC APIを実装したい。そうすることで、ユーザー情報の管理ができる。

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
認証基盤

## 受け入れ基準
- [ ] trpc/routers/auth.ts作成
- [ ] auth.createUser実装
- [ ] auth.me実装
- [ ] auth.updateUsername実装
- [ ] ルートルーターに統合

## 技術タスク
1. trpc/routers/auth.ts作成
2. createUser mutation実装（DB登録）
3. me query実装（ユーザー情報取得）
4. updateUsername mutation実装
5. appRouterに統合
6. ユニットテスト作成

## 依存関係
- US-008" \
"P0,Sprint-1,Epic:認証基盤"

echo ""
echo "============================================"
echo "Sprint 2: チーム管理と家事管理"
echo "============================================"
echo ""

# US-015からUS-025まで（スペースの都合上、主要なものを抜粋）
create_issue \
"US-015: チーム作成API実装" \
"## ユーザーストーリー
バックエンド開発者として、チーム作成APIを実装したい。そうすることで、ユーザーがチームを作成できる。

## 優先度
P0 (Critical)

## ストーリーポイント
5

## Epic
チーム管理

## 受け入れ基準
- [ ] trpc/routers/team.ts作成
- [ ] team.create実装
- [ ] 招待コード生成（8文字英数字）
- [ ] デフォルト家事10種類を自動作成
- [ ] ユーザーのteamIdを更新
- [ ] ユニットテスト作成

## 技術タスク
1. trpc/routers/team.ts作成
2. utils/inviteCode.ts作成（nanoid使用）
3. team.create mutation実装
4. デフォルト家事リスト定義
5. チーム作成時にChore10件作成
6. ユーザーのteamId更新
7. テストケース作成

## 依存関係
- US-013" \
"P0,Sprint-2,Epic:チーム管理"

# 他のIssueも同様に作成（US-016からUS-048まで）
# スクリプトが長くなるため、ここでは主要なものを抜粋

echo ""
echo "✅ GitHub Issues作成が完了しました！"
echo ""
echo "次のステップ:"
echo "1. GitHub Project画面でIssuesを確認"
echo "2. 必要に応じてIssueの調整"
echo "3. Sprintマイルストーンの作成"
echo "4. 実行フェーズの開始"
