# 実装計画書

前段階の`.cursor_workflow/specs/design.md`を読み込みました。

## 1. 実装方針
- issueを実行する前にはmainブランチに切り替えて最新の状態にしてからissue用のブランチを切る
### 1.1 開発手法
- **アジャイル・スクラム開発**を採用
- 2週間スプリント × 4スプリント（合計8週間）
- MVP（Minimum Viable Product）を第1優先として実装

### 1.2 優先順位付け
- **P0 (Critical)**: MVPに必須の機能
- **P1 (High)**: 早期リリースに必要な機能
- **P2 (Medium)**: リリース後に追加可能な機能
- **P3 (Low)**: 将来的な拡張機能

### 1.3 定義
- **ストーリーポイント**: フィボナッチ数列（1, 2, 3, 5, 8, 13）
- **1スプリント**: 約40ストーリーポイント
- **完了の定義**: コード実装、ユニットテスト、レビュー完了、mainブランチマージ

---

## 2. スプリント計画

### Sprint 0: プロジェクト初期設定 (Week 0)
**目標**: 開発環境を整え、基盤を構築する

### Sprint 1: 認証とインフラ基盤 (Week 1-2)
**目標**: ユーザー認証とバックエンド基盤を構築する

### Sprint 2: チーム管理と家事管理 (Week 3-4)
**目標**: チーム作成・参加、家事リスト管理機能を実装する

### Sprint 3: 家事記録とダッシュボード (Week 5-6)
**目標**: 家事記録、ポイント計算、ダッシュボード機能を実装する

### Sprint 4: テスト・CI/CD・デプロイ (Week 7-8)
**目標**: テスト実装、CI/CD構築、本番デプロイを行う

---

## 3. エピック一覧

### Epic 1: プロジェクト基盤構築
モノレポ構成、開発環境、基本設定を構築

### Epic 2: 認証基盤
Cognito統合、ユーザー登録・ログイン機能

### Epic 3: チーム管理
チーム作成・参加、メンバー管理

### Epic 4: 家事管理
家事リスト表示・追加・編集、ストレス度設定

### Epic 5: 家事記録
家事完了記録、ポイント計算

### Epic 6: ダッシュボード
ランキング表示、貢献度グラフ

### Epic 7: テスト・品質保証
ユニットテスト、統合テスト、カバレッジ確保

### Epic 8: CI/CD・デプロイ
GitHub Actions設定、AWS CDKデプロイ

---

## 4. ユーザーストーリー詳細

---

## Sprint 0: プロジェクト初期設定

### US-001: モノレポ初期設定
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
開発者として、モノレポ構成でプロジェクトをセットアップしたい。そうすることで、backend、frontend、infraを一元管理できる。

**受け入れ基準**:
- [x] ルートpackage.jsonにworkspaces設定
- [x] backend、frontend、infraディレクトリ作成
- [x] 各ディレクトリにpackage.json作成
- [x] TypeScript設定ファイル作成
- [x] .gitignore、.gitattributes設定
- [x] README.md作成

**技術タスク**:
1. `npm init` でルートpackage.json作成
2. workspaces設定 (backend, frontend, infra)
3. backend/package.json作成
4. frontend/package.json作成
5. infra/package.json作成
6. ルートtsconfig.json作成
7. README.md作成

---

### US-002: Biome設定
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 2

**ユーザーストーリー**:
開発者として、Biomeを使用してコードフォーマットとLintを統一したい。そうすることで、コード品質を保てる。

**受け入れ基準**:
- [x] biome.json作成
- [x] Google TypeScript Style Guideに準拠
- [x] npm scriptsにlint、formatコマンド追加
- [x] 全パッケージでBiome動作確認

**技術タスク**:
1. Biomeをルートにインストール
2. biome.json作成（Google TS Style Guide準拠）
3. backend、frontend、infraのpackage.jsonにスクリプト追加
4. 動作確認

---

### US-003: バックエンド基本構成
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
開発者として、Expressサーバーの基本構成を作成したい。そうすることで、tRPCエンドポイントを提供できる。

**受け入れ基準**:
- [x] Expressサーバーが起動する
- [x] tRPCの基本設定が完了している
- [x] ローカル環境で動作確認できる
- [x] 環境変数の管理ができる

**技術タスク**:
1. Express、tRPC、Prisma等の依存関係インストール
2. src/index.ts作成（Expressサーバー）
3. src/trpc/trpc.ts作成（tRPC初期化）
4. src/trpc/context.ts作成（コンテキスト）
5. src/trpc/router.ts作成（ルートルーター）
6. .env.example作成
7. 開発サーバー起動スクリプト追加

---

### US-004: Prisma初期設定
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
開発者として、Prismaを使用してデータベーススキーマを管理したい。そうすることで、型安全なデータベース操作ができる。

**受け入れ基準**:
- [x] prisma/schema.prisma作成
- [x] 全5テーブル（User, Team, Chore, UserChoreStress, ChoreLog）定義
- [x] PostgreSQLにマイグレーション実行
- [x] Prisma Clientが生成される

**技術タスク**:
1. Prismaインストール
2. `npx prisma init`実行
3. schema.prisma作成（設計書通り）
4. ローカルPostgreSQL起動
5. `npx prisma migrate dev`実行
6. `npx prisma generate`実行
7. lib/prisma.ts作成（Prismaクライアント）

---

### US-005: フロントエンド基本構成
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、React + Viteのフロントエンド環境を構築したい。そうすることで、モダンなSPAを開発できる。

**受け入れ基準**:
- [x] Vite + Reactプロジェクトが起動する
- [x] TypeScript設定完了
- [x] Tailwind CSS設定完了
- [x] React Routerの基本設定完了
- [x] tRPCクライアント設定完了

**技術タスク**:
1. `npm create vite@latest`実行
2. React + TypeScript選択
3. Tailwind CSSインストール・設定
4. React Routerインストール・設定
5. tRPC Clientインストール・設定
6. src/app/routes.tsx作成
7. src/lib/trpc.ts作成
8. 開発サーバー起動確認

---

### US-006: shadcn/ui導入
**Epic**: プロジェクト基盤構築  
**優先度**: P1  
**ストーリーポイント**: 3

**ユーザーストーリー**:
開発者として、shadcn/uiを導入してUIコンポーネントを使用したい。そうすることで、美しいUIを効率的に構築できる。

**受け入れ基準**:
- [x] shadcn/ui初期設定完了
- [x] 基本コンポーネント（Button, Input, Dialog等）追加
- [x] components/ui/ディレクトリ作成
- [x] サンプルページで動作確認

**技術タスク**:
1. `npx shadcn-ui@latest init`実行
2. components.json設定
3. Button、Input、Dialog、Card等の基本コンポーネント追加
4. サンプルページ作成して動作確認

---

## Sprint 1: 認証とインフラ基盤

### US-007: AWS Cognito User Pool作成
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、AWS Cognito User Poolを作成したい。そうすることで、ユーザー認証機能を提供できる。

**受け入れ基準**:
- [x] Cognito User Pool作成（CDKまたはコンソール）
- [x] User Pool Clientアプリ作成
- [x] パスワードポリシー設定
- [x] メール検証設定
- [x] User Pool IDとClient IDを環境変数に設定

**技術タスク**:
1. infra/lib/cognito-stack.ts作成
2. User Pool設定（パスワードポリシー、メール検証等）
3. User Pool Client作成
4. CDKでデプロイ（またはコンソールで作成）
5. 出力されたIDを.envに設定

---

### US-008: Cognito JWT検証実装
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、Cognitoから発行されたJWTを検証したい。そうすることで、認証済みユーザーのみAPIアクセスを許可できる。

**受け入れ基準**:
- [x] aws-jwt-verifyパッケージ導入
- [x] utils/cognito.ts作成
- [x] verifyCognitoToken関数実装
- [x] tRPCコンテキストでJWT検証
- [x] protectedProcedure実装

**技術タスク**:
1. aws-jwt-verifyインストール
2. utils/cognito.ts作成
3. verifyCognitoToken関数実装
4. context.tsでJWT検証実装
5. trpc.tsでprotectedProcedure実装
6. テストケース作成

---

### US-009: フロントエンドAmplify統合
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
フロントエンド開発者として、AWS AmplifyでCognito認証を統合したい。そうすることで、ユーザー登録・ログイン機能を実装できる。

**受け入れ基準**:
- [x] aws-amplifyパッケージ導入
- [x] lib/amplify.ts作成
- [x] Cognito設定
- [x] features/auth/hooks/useAuth.ts作成
- [x] 認証状態管理実装

**技術タスク**:
1. aws-amplifyインストール
2. lib/amplify.ts作成（Amplify.configure）
3. features/auth/hooks/useAuth.ts作成
4. signUp、confirmSignUp、signIn、signOut関数実装
5. 認証状態管理（Zustandまたはcontext）
6. ProtectedRouteコンポーネント作成

---

### US-010: ユーザー登録画面
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
新規ユーザーとして、メールアドレスとパスワードでアカウントを登録したい。そうすることで、アプリを使い始めることができる。

**受け入れ基準**:
- [x] /registerページ作成
- [x] フォーム（ユーザー名、メール、パスワード）実装
- [x] React Hook Form + Zod バリデーション
- [x] Amplify signUp()呼び出し
- [x] 成功時、確認画面へ遷移
- [x] エラーハンドリング

**技術タスク**:
1. features/auth/pages/RegisterPage.tsx作成
2. React Hook Form設定
3. Zodスキーマ定義
4. useAuth hookを使用してsignUp実行
5. エラーハンドリング実装
6. 成功時に/confirm-emailへ遷移

---

### US-011: メール確認画面
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
新規ユーザーとして、メールで受信した確認コードを入力したい。そうすることで、メールアドレスを検証できる。

**受け入れ基準**:
- [x] /confirm-emailページ作成
- [x] 確認コード入力フォーム実装
- [x] Amplify confirmSignUp()呼び出し
- [x] 成功時、tRPC auth.createUserでDB登録
- [x] /app/team-setupへ遷移
- [x] エラーハンドリング

**技術タスク**:
1. features/auth/pages/ConfirmEmailPage.tsx作成
2. 確認コード入力フォーム実装
3. confirmSignUp実行
4. 成功時にcurrentUserのSubを取得
5. tRPC auth.createUserでDB登録
6. /app/team-setupへ遷移

---

### US-012: ログイン画面
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
既存ユーザーとして、メールアドレスとパスワードでログインしたい。そうすることで、アプリを使用できる。

**受け入れ基準**:
- [x] /loginページ作成
- [x] フォーム（メール、パスワード）実装
- [x] Amplify signIn()呼び出し
- [x] 成功時、適切なページへリダイレクト
- [x] エラーハンドリング

**技術タスク**:
1. features/auth/pages/LoginPage.tsx作成
2. React Hook Form設定
3. useAuth hookを使用してsignIn実行
4. 成功時にtRPC auth.meでユーザー情報取得
5. チーム所属状況に応じてリダイレクト
6. エラーハンドリング実装

---

### US-013: 認証ルーターAPI実装
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、認証関連のtRPC APIを実装したい。そうすることで、ユーザー情報の管理ができる。

**受け入れ基準**:
- [x] trpc/routers/auth.ts作成
- [x] auth.createUser実装
- [x] auth.me実装
- [x] auth.updateUsername実装
- [x] ルートルーターに統合

**技術タスク**:
1. trpc/routers/auth.ts作成
2. createUser mutation実装（DB登録）
3. me query実装（ユーザー情報取得）
4. updateUsername mutation実装
5. appRouterに統合
6. ユニットテスト作成

---

### US-014: RDS開発環境構築
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、ローカル開発用のPostgreSQLデータベースをセットアップしたい。そうすることで、開発環境で動作確認できる。

**受け入れ基準**:
- [x] ローカルPostgreSQLインストール
- [x] kazikashikaデータベース作成
- [x] Prismaマイグレーション実行
- [x] 接続確認

**技術タスク**:
1. PostgreSQLインストール（Docker or ローカル）
2. データベース作成
3. DATABASE_URL設定
4. `npx prisma migrate dev`実行
5. Prisma Studioで確認

---

## Sprint 2: チーム管理と家事管理

### US-015: チーム作成API実装
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
バックエンド開発者として、チーム作成APIを実装したい。そうすることで、ユーザーがチームを作成できる。

**受け入れ基準**:
- [x] trpc/routers/team.ts作成
- [x] team.create実装
- [x] 招待コード生成（8文字英数字）
- [x] デフォルト家事10種類を自動作成
- [x] ユーザーのteamIdを更新
- [x] ユニットテスト作成

**技術タスク**:
1. trpc/routers/team.ts作成
2. utils/inviteCode.ts作成（nanoid使用）
3. team.create mutation実装
4. デフォルト家事リスト定義
5. チーム作成時にChore10件作成
6. ユーザーのteamId更新
7. テストケース作成

---

### US-016: チーム参加API実装
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、チーム参加APIを実装したい。そうすることで、ユーザーが招待コードでチームに参加できる。

**受け入れ基準**:
- [x] team.join実装
- [x] 招待コードでチーム検索
- [x] ユーザーのteamIdを更新
- [x] 既にチーム所属の場合はエラー
- [x] ユニットテスト作成

**技術タスク**:
1. team.join mutation実装
2. inviteCodeでTeam検索
3. 既存チーム所属チェック
4. ユーザーのteamId更新
5. エラーハンドリング
6. テストケース作成

---

### US-017: チーム情報取得API実装
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 2

**ユーザーストーリー**:
バックエンド開発者として、チーム情報取得APIを実装したい。そうすることで、チーム名や招待コードを表示できる。

**受け入れ基準**:
- [x] team.get実装
- [x] team.getMembers実装
- [x] チーム所属チェック
- [x] ユニットテスト作成

**技術タスク**:
1. team.get query実装
2. team.getMembers query実装
3. teamIdチェック
4. テストケース作成

---

### US-018: チームセットアップ画面
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
新規ユーザーとして、チームを作成または参加したい。そうすることで、チームメンバーと家事を共有できる。

**受け入れ基準**:
- [x] /app/team-setupページ作成
- [x] チーム作成フォーム実装
- [x] チーム参加フォーム実装
- [x] tRPC team.create / team.join呼び出し
- [x] 成功時、オンボーディングへ遷移
- [x] エラーハンドリング

**技術タスク**:
1. features/auth/pages/TeamSetupPage.tsx作成
2. チーム作成・参加の切り替えUI実装
3. チーム名入力フォーム（作成時）
4. 招待コード入力フォーム（参加時）
5. tRPC呼び出し
6. 成功時に/app/onboardingへ遷移

---

### US-019: 家事リスト取得API実装
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、家事リスト取得APIを実装したい。そうすることで、チームの家事とユーザーのストレス度を表示できる。

**受け入れ基準**:
- [x] trpc/routers/chore.ts作成
- [x] chore.list実装
- [x] チームの家事リスト取得
- [x] ユーザーのストレス度を含める
- [x] ユニットテスト作成

**技術タスク**:
1. trpc/routers/chore.ts作成
2. chore.list query実装
3. Choreをteamでフィルタ
4. UserChoreStressをincludeで取得
5. レスポンス整形
6. テストケース作成

---

### US-020: ストレス度一括設定API実装
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、ストレス度一括設定APIを実装したい。そうすることで、オンボーディング時に全家事のストレス度を保存できる。

**受け入れ基準**:
- [x] chore.setStressLevels実装
- [x] 複数のストレス度を一括upsert
- [x] バリデーション（1〜5）
- [x] ユニットテスト作成

**技術タスク**:
1. chore.setStressLevels mutation実装
2. 配列で複数のストレス度を受け取る
3. upsertでUserChoreStress作成・更新
4. Zodバリデーション（1〜5）
5. テストケース作成

---

### US-021: オンボーディング画面
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 8

**ユーザーストーリー**:
新規ユーザーとして、デフォルト家事に対するストレス度を設定したい。そうすることで、自分に合ったポイント計算ができる。

**受け入れ基準**:
- [x] /app/onboardingページ作成
- [x] 家事を1つずつ表示
- [x] ストレス度選択UI（1〜5）
- [x] プログレスバー表示
- [x] tRPC chore.listで家事取得
- [x] tRPC chore.setStressLevels呼び出し
- [x] 完了時、/app/homeへ遷移

**技術タスク**:
1. features/onboarding/pages/OnboardingPage.tsx作成
2. chore.list呼び出し
3. 1件ずつ家事表示ロジック実装
4. ストレス度選択UI（ボタンまたはスライダー）
5. プログレスバー実装（例: 3/10）
6. 全完了時にsetStressLevels呼び出し
7. /app/homeへ遷移

---

### US-022: 家事追加API実装
**Epic**: 家事管理  
**優先度**: P1  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、家事追加APIを実装したい。そうすることで、ユーザーがカスタム家事を追加できる。

**受け入れ基準**:
- [x] chore.create実装
- [x] 家事名とストレス度を受け取る
- [x] Choreレコード作成
- [x] UserChoreStressレコード作成
- [x] ユニットテスト作成

**技術タスク**:
1. chore.create mutation実装
2. Chore作成（isDefault: false）
3. UserChoreStress作成
4. Zodバリデーション
5. テストケース作成

---

### US-023: 家事編集API実装
**Epic**: 家事管理  
**優先度**: P1  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、家事編集APIを実装したい。そうすることで、家事名やストレス度を変更できる。

**受け入れ基準**:
- [x] chore.updateName実装
- [x] chore.updateStressLevel実装
- [x] チームの家事かチェック
- [x] ユニットテスト作成

**技術タスク**:
1. chore.updateName mutation実装
2. chore.updateStressLevel mutation実装
3. teamIdでアクセス制御
4. テストケース作成

---

### US-024: ホーム画面（家事リスト表示）
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
ユーザーとして、家事リストを表示したい。そうすることで、完了すべき家事を確認できる。

**受け入れ基準**:
- [x] /app/homeページ作成
- [x] tRPC chore.list呼び出し
- [x] 家事リスト表示
- [x] 各家事に「完了」ボタン表示
- [x] ローディング状態表示

**技術タスク**:
1. features/chores/pages/HomePage.tsx作成
2. tRPC chore.list呼び出し
3. ChoreListコンポーネント作成
4. 各家事カード表示
5. 完了ボタン実装（モーダル表示準備）
6. ローディング・エラー表示

---

### US-025: 家事管理画面
**Epic**: 家事管理  
**優先度**: P1  
**ストーリーポイント**: 5

**ユーザーストーリー**:
ユーザーとして、家事を追加・編集したい。そうすることで、家庭に合わせた家事リストを作成できる。

**受け入れ基準**:
- [x] /app/choresページ作成
- [x] 家事リスト表示
- [x] 「新しい家事を追加」ボタン
- [x] 家事追加モーダル実装
- [x] 家事編集モーダル実装
- [x] tRPC呼び出し

**技術タスク**:
1. features/chores/pages/ChoresManagementPage.tsx作成
2. 家事リスト表示
3. 家事追加モーダルコンポーネント作成
4. 家事編集モーダルコンポーネント作成
5. tRPC chore.create / updateName / updateStressLevel呼び出し
6. キャッシュ無効化（React Query）

---

## Sprint 3: 家事記録とダッシュボード

### US-026: ポイント計算ユーティリティ実装
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 2

**ユーザーストーリー**:
バックエンド開発者として、ポイント計算ロジックを実装したい。そうすることで、正確なポイントを計算できる。

**受け入れ基準**:
- [x] utils/pointCalculator.ts作成
- [x] calculatePoints関数実装
- [x] バリデーション（時間: 1〜999、ストレス度: 1〜5）
- [x] ユニットテスト作成（カバレッジ100%）

**技術タスク**:
1. utils/pointCalculator.ts作成
2. calculatePoints実装（time × stress）
3. バリデーション実装
4. エラーハンドリング
5. テストケース作成（正常系・異常系）

---

### US-027: 家事記録API実装
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
バックエンド開発者として、家事記録APIを実装したい。そうすることで、家事完了記録とポイント計算ができる。

**受け入れ基準**:
- [x] trpc/routers/choreLog.ts作成
- [x] choreLog.create実装
- [x] ストレス度取得
- [x] ポイント計算
- [x] ChoreLogレコード作成
- [x] ユニットテスト作成

**技術タスク**:
1. trpc/routers/choreLog.ts作成
2. choreLog.create mutation実装
3. UserChoreStressからストレス度取得
4. calculatePoints呼び出し
5. ChoreLog作成
6. レスポンスに獲得ポイント含める
7. テストケース作成

---

### US-028: 家事記録モーダル実装
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
ユーザーとして、家事完了時に時間を入力したい。そうすることで、ポイントを獲得できる。

**受け入れ基準**:
- [x] 時間入力モーダルコンポーネント作成
- [x] 選択肢ボタン（15分、30分、45分、60分）実装
- [x] 自由入力欄（1〜999分）実装
- [x] tRPC choreLog.create呼び出し
- [x] 獲得ポイントをトースト通知表示

**技術タスク**:
1. features/logs/components/ChoreLogModal.tsx作成
2. Dialog（shadcn/ui）使用
3. 時間選択ボタン実装
4. 自由入力欄実装（数値バリデーション）
5. tRPC choreLog.create呼び出し
6. sonnerでトースト通知実装
7. キャッシュ無効化

---

### US-029: Zustandストア実装（UIステート）
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 2

**ユーザーストーリー**:
開発者として、モーダルの開閉状態を管理したい。そうすることで、UI状態を適切に管理できる。

**受け入れ基準**:
- [x] stores/uiStore.ts作成
- [x] isChoreLogModalOpen状態管理
- [x] selectedChoreId状態管理
- [x] openChoreLogModal、closeChoreLogModal実装

**技術タスク**:
1. Zustandインストール
2. stores/uiStore.ts作成
3. モーダル開閉状態管理
4. 選択された家事ID管理
5. ホーム画面でストア使用

---

### US-030: 期間計算ユーティリティ実装
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 2

**ユーザーストーリー**:
バックエンド開発者として、期間計算ロジックを実装したい。そうすることで、ランキングを期間でフィルタできる。

**受け入れ基準**:
- [x] utils/dateRange.ts作成
- [x] getDateRange関数実装
- [x] 「今週」= 過去7日間
- [x] 「今月」= 当月1日から本日
- [x] ユニットテスト作成

**技術タスク**:
1. utils/dateRange.ts作成
2. getDateRange実装（week / month）
3. 日付計算ロジック実装
4. テストケース作成

---

### US-031: ランキング取得API実装
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
バックエンド開発者として、ランキング取得APIを実装したい。そうすることで、チームメンバーのポイントランキングを表示できる。

**受け入れ基準**:
- [x] trpc/routers/dashboard.ts作成
- [x] dashboard.getRanking実装
- [x] 期間フィルタリング（今週・今月）
- [x] チームメンバーのポイント集計
- [x] ランキングソート
- [x] ユニットテスト作成

**技術タスク**:
1. trpc/routers/dashboard.ts作成
2. dashboard.getRanking query実装
3. getDateRange呼び出し
4. User + ChoreLog取得（include）
5. ポイント集計・ソート
6. ランク付け
7. テストケース作成

---

### US-032: 貢献度取得API実装
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、貢献度取得APIを実装したい。そうすることで、円グラフで貢献度を表示できる。

**受け入れ基準**:
- [x] dashboard.getContribution実装
- [x] 期間フィルタリング
- [x] チームメンバーのポイント集計
- [x] 貢献度割合計算
- [x] ユニットテスト作成

**技術タスク**:
1. dashboard.getContribution query実装
2. getDateRange呼び出し
3. User + ChoreLog取得
4. ポイント集計
5. 割合計算（小数点第1位）
6. テストケース作成

---

### US-033: ダッシュボード画面
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 8

**ユーザーストーリー**:
ユーザーとして、チームの貢献度とランキングを確認したい。そうすることで、家事分担のバランスを把握できる。

**受け入れ基準**:
- [x] /app/dashboardページ作成
- [x] 期間選択タブ（今週・今月）実装
- [x] 円グラフ表示（Recharts）
- [x] ランキングリスト表示
- [x] tRPC dashboard.getRanking / getContribution呼び出し
- [x] レスポンシブデザイン

**技術タスク**:
1. features/dashboard/pages/DashboardPage.tsx作成
2. Rechartsインストール
3. 期間選択タブ実装
4. 円グラフコンポーネント作成（PieChart）
5. ランキングリストコンポーネント作成
6. tRPC呼び出し
7. ローディング・エラー表示
8. レスポンシブ対応

---

### US-034: 家事記録履歴取得API実装
**Epic**: 家事記録  
**優先度**: P2  
**ストーリーポイント**: 3

**ユーザーストーリー**:
バックエンド開発者として、家事記録履歴取得APIを実装したい。そうすることで、過去の記録を閲覧できる。

**受け入れ基準**:
- [x] choreLog.list実装
- [x] 期間フィルタリング（オプション）
- [x] ユーザー指定（オプション）
- [x] チームメンバーのみアクセス可能
- [x] ユニットテスト作成

**技術タスク**:
1. choreLog.list query実装
2. 期間・ユーザーフィルタ実装
3. チームメンバーチェック
4. ChoreLogとChore取得
5. 日付降順ソート
6. テストケース作成

---

## Sprint 4: テスト・CI/CD・デプロイ

### US-035: バックエンドユニットテスト実装
**Epic**: テスト・品質保証  
**優先度**: P0  
**ストーリーポイント**: 8

**ユーザーストーリー**:
開発者として、バックエンドのユニットテストを作成したい。そうすることで、コードの品質を保証できる。

**受け入れ基準**:
- [x] Vitest設定完了
- [x] ユーティリティ関数のテスト（pointCalculator、dateRange、inviteCode）
- [x] tRPCルーターの統合テスト
- [x] カバレッジ85%以上達成
- [x] CIで自動実行

**技術タスク**:
1. vitest.config.ts設定
2. tests/unit/配下にテスト作成
3. pointCalculator.test.ts
4. dateRange.test.ts
5. inviteCode.test.ts
6. tests/integration/配下にルーターテスト作成
7. カバレッジレポート確認
8. 不足箇所のテスト追加

---

### US-036: フロントエンドユニットテスト実装
**Epic**: テスト・品質保証  
**優先度**: P0  
**ストーリーポイント**: 8

**ユーザーストーリー**:
開発者として、フロントエンドのユニットテストを作成したい。そうすることで、UIコンポーネントの品質を保証できる。

**受け入れ基準**:
- [x] Vitest + React Testing Library設定
- [x] 主要コンポーネントのテスト作成
- [x] カバレッジ75%以上達成
- [x] CIで自動実行

**技術タスク**:
1. vitest.config.ts設定
2. @testing-library/reactインストール
3. tests/unit/配下にテスト作成
4. ChoreList.test.tsx
5. ChoreLogModal.test.tsx
6. DashboardPage.test.tsx
7. カバレッジレポート確認
8. 不足箇所のテスト追加

---

### US-037: GitHub Actions CI設定（バックエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、バックエンドのCIを構築したい。そうすることで、コード品質を自動チェックできる。

**受け入れ基準**:
- [x] .github/workflows/backend-ci.yml作成
- [x] Lint、Test、Coverage実行
- [x] PRでCI自動実行
- [x] mainブランチプッシュでCI実行

**技術タスク**:
1. .github/workflows/backend-ci.yml作成
2. Lintステップ追加
3. Testステップ追加
4. Coverageチェック追加
5. パス指定（backend/**）
6. 動作確認

---

### US-038: GitHub Actions CI設定（フロントエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、フロントエンドのCIを構築したい。そうすることで、コード品質を自動チェックできる。

**受け入れ基準**:
- [x] .github/workflows/frontend-ci.yml作成
- [x] Lint、Test、Coverage実行
- [x] PRでCI自動実行
- [x] mainブランチプッシュでCI実行

**技術タスク**:
1. .github/workflows/frontend-ci.yml作成
2. Lintステップ追加
3. Testステップ追加
4. Coverageチェック追加
5. パス指定（frontend/**）
6. 動作確認

---

### US-039: AWS CDK Database Stack実装
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、RDSをCDKでデプロイしたい。そうすることで、本番環境のデータベースを構築できる。

**受け入れ基準**:
- [x] infra/lib/database-stack.ts作成
- [x] VPC設定
- [x] RDS PostgreSQL設定（db.t3.micro）
- [x] セキュリティグループ設定
- [x] デプロイ成功

**技術タスク**:
1. infra/lib/database-stack.ts作成
2. VPC定義（2AZ、NAT Gateway 1つ）
3. SecurityGroup定義
4. DatabaseInstance定義
5. Secrets Manager連携
6. `cdk synth`で確認
7. `cdk deploy DatabaseStack`実行

---

### US-040: AWS CDK Backend Stack実装
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、Lambda + API GatewayをCDKでデプロイしたい。そうすることで、バックエンドAPIを公開できる。

**受け入れ基準**:
- [x] infra/lib/backend-stack.ts作成
- [x] Lambda関数定義
- [x] API Gateway設定
- [x] 環境変数設定（DATABASE_URL, COGNITO等）
- [x] デプロイ成功

**技術タスク**:
1. infra/lib/backend-stack.ts作成
2. Lambda Function定義
3. API Gateway HTTP API定義
4. Lambda統合設定
5. CORS設定
6. 環境変数設定
7. VPC接続設定
8. `cdk deploy BackendStack`実行

---

### US-041: AWS CDK Frontend Stack実装
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、S3 + CloudFrontをCDKでデプロイしたい。そうすることで、フロントエンドを公開できる。

**受け入れ基準**:
- [x] infra/lib/frontend-stack.ts作成
- [x] S3バケット設定
- [x] CloudFront Distribution設定
- [x] SPA対応（エラーページ設定）
- [x] デプロイ成功

**技術タスク**:
1. infra/lib/frontend-stack.ts作成
2. S3 Bucket定義（静的ホスティング）
3. CloudFront Distribution定義
4. エラーページ設定（404 → index.html）
5. BucketDeployment定義
6. `cdk deploy FrontendStack`実行

---

### US-042: GitHub Actions CD設定（バックエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P1  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、バックエンドのCDを構築したい。そうすることで、mainブランチへのマージで自動デプロイできる。

**受け入れ基準**:
- [x] backend-ci.ymlにdeployジョブ追加
- [x] mainブランチのみデプロイ実行
- [x] ビルド → CDKデプロイ
- [x] AWS認証情報をSecretsで管理

**技術タスク**:
1. backend-ci.ymlにdeployジョブ追加
2. needs: testで依存関係設定
3. if: github.ref == 'refs/heads/main'
4. npm run build実行
5. cdk deploy BackendStack実行
6. AWS_ACCESS_KEY_IDとAWS_SECRET_ACCESS_KEYをSecretsに登録

---

### US-043: GitHub Actions CD設定（フロントエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P1  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、フロントエンドのCDを構築したい。そうすることで、mainブランチへのマージで自動デプロイできる。

**受け入れ基準**:
- [x] frontend-ci.ymlにdeployジョブ追加
- [x] mainブランチのみデプロイ実行
- [x] ビルド → CDKデプロイ
- [x] 環境変数設定

**技術タスク**:
1. frontend-ci.ymlにdeployジョブ追加
2. needs: testで依存関係設定
3. if: github.ref == 'refs/heads/main'
4. 環境変数設定（VITE_API_URL等）
5. npm run build実行
6. cdk deploy FrontendStack実行

---

### US-044: エラーハンドリング実装
**Epic**: テスト・品質保証  
**優先度**: P1  
**ストーリーポイント**: 3

**ユーザーストーリー**:
開発者として、適切なエラーハンドリングを実装したい。そうすることで、ユーザーにわかりやすいエラーメッセージを表示できる。

**受け入れ基準**:
- [x] バックエンドでtRPCErrorハンドリング実装
- [x] PrismaエラーをtRPCErrorに変換
- [x] フロントエンドでトースト通知表示
- [x] React Query onError設定

**技術タスク**:
1. middleware/errorHandler.ts作成
2. Prismaエラーハンドリング実装
3. tRPCエラーマッピング
4. フロントエンドでQueryClient設定
5. onErrorでトースト表示
6. エラー境界（Error Boundary）実装

---

### US-045: レスポンシブデザイン対応
**Epic**: テスト・品質保証  
**優先度**: P1  
**ストーリーポイント**: 5

**ユーザーストーリー**:
ユーザーとして、スマートフォンでも快適に使いたい。そうすることで、どのデバイスでもアプリを利用できる。

**受け入れ基準**:
- [x] 全画面でレスポンシブ対応
- [x] スマートフォン（375px〜）で表示確認
- [x] タブレット（768px〜）で表示確認
- [x] PC（1024px〜）で表示確認
- [x] Tailwind CSSのブレークポイント使用

**技術タスク**:
1. 各ページでレスポンシブクラス追加
2. モバイルファーストで実装
3. sm:、md:、lg:ブレークポイント活用
4. グリッドレイアウト調整
5. フォントサイズ調整
6. デバイスごとに動作確認

---

### US-046: パフォーマンス最適化
**Epic**: テスト・品質保証  
**優先度**: P2  
**ストーリーポイント**: 5

**ユーザーストーリー**:
開発者として、アプリのパフォーマンスを最適化したい。そうすることで、高速で快適なUXを提供できる。

**受け入れ基準**:
- [x] React.lazy + Suspense でコード分割
- [x] React Query staleTime設定
- [x] 画像最適化
- [x] Lighthouseスコア80以上

**技術タスク**:
1. React.lazy + Suspenseでページコンポーネント遅延読み込み
2. React Query staleTime設定
3. 画像圧縮・WebP化
4. 不要なre-render削減（useMemo、useCallback）
5. Lighthouseで計測
6. パフォーマンス改善

---

### US-047: 本番環境デプロイ
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 8

**ユーザーストーリー**:
開発者として、本番環境にデプロイしたい。そうすることで、ユーザーにアプリを提供できる。

**受け入れ基準**:
- [x] Cognito User Pool本番環境作成
- [x] RDS本番環境作成
- [x] Lambda + API Gateway本番環境デプロイ
- [x] S3 + CloudFront本番環境デプロイ
- [x] データベースマイグレーション実行
- [x] 動作確認完了

**技術タスク**:
1. CDK全スタックデプロイ
2. Cognito設定確認
3. RDS接続確認
4. Prismaマイグレーション実行
5. フロントエンド環境変数設定
6. 全機能動作確認
7. ドメイン設定（オプション）

---

### US-048: ドキュメント整備
**Epic**: テスト・品質保証  
**優先度**: P2  
**ストーリーポイント**: 3

**ユーザーストーリー**:
開発者として、ドキュメントを整備したい。そうすることで、チームメンバーが理解しやすくなる。

**受け入れ基準**:
- [x] 各パッケージのREADME作成
- [x] セットアップ手順記載
- [x] 環境変数の説明
- [x] デプロイ手順記載

**技術タスク**:
1. backend/README.md作成
2. frontend/README.md作成
3. infra/README.md作成
4. ルートREADME.md更新
5. 環境変数一覧作成
6. トラブルシューティング追加

---

## 5. 依存関係グラフ

```
Sprint 0 (基盤)
  ├─ US-001 (モノレポ)
  ├─ US-002 (Biome)
  ├─ US-003 (バックエンド基本)
  │    └─ US-004 (Prisma)
  ├─ US-005 (フロントエンド基本)
  │    └─ US-006 (shadcn/ui)
  └─ US-014 (RDS開発環境)

Sprint 1 (認証)
  ├─ US-007 (Cognito作成)
  ├─ US-008 (JWT検証) ← US-007
  ├─ US-009 (Amplify統合) ← US-007
  ├─ US-010 (登録画面) ← US-009
  ├─ US-011 (確認画面) ← US-010, US-013
  ├─ US-012 (ログイン画面) ← US-009, US-013
  └─ US-013 (認証API) ← US-008

Sprint 2 (チーム・家事)
  ├─ US-015 (チーム作成API) ← US-013
  ├─ US-016 (チーム参加API) ← US-013
  ├─ US-017 (チーム情報API) ← US-013
  ├─ US-018 (チームセットアップ画面) ← US-015, US-016
  ├─ US-019 (家事リストAPI) ← US-013
  ├─ US-020 (ストレス度API) ← US-013
  ├─ US-021 (オンボーディング画面) ← US-019, US-020
  ├─ US-022 (家事追加API) ← US-013
  ├─ US-023 (家事編集API) ← US-013
  ├─ US-024 (ホーム画面) ← US-019
  └─ US-025 (家事管理画面) ← US-019, US-022, US-023

Sprint 3 (記録・ダッシュボード)
  ├─ US-026 (ポイント計算)
  ├─ US-027 (家事記録API) ← US-026
  ├─ US-028 (記録モーダル) ← US-027, US-029
  ├─ US-029 (Zustandストア)
  ├─ US-030 (期間計算)
  ├─ US-031 (ランキングAPI) ← US-030
  ├─ US-032 (貢献度API) ← US-030
  ├─ US-033 (ダッシュボード画面) ← US-031, US-032
  └─ US-034 (記録履歴API)

Sprint 4 (テスト・デプロイ)
  ├─ US-035 (バックエンドテスト)
  ├─ US-036 (フロントエンドテスト)
  ├─ US-037 (バックエンドCI)
  ├─ US-038 (フロントエンドCI)
  ├─ US-039 (Database Stack)
  ├─ US-040 (Backend Stack) ← US-039
  ├─ US-041 (Frontend Stack)
  ├─ US-042 (バックエンドCD) ← US-037, US-040
  ├─ US-043 (フロントエンドCD) ← US-038, US-041
  ├─ US-044 (エラーハンドリング)
  ├─ US-045 (レスポンシブ対応)
  ├─ US-046 (パフォーマンス最適化)
  ├─ US-047 (本番デプロイ) ← US-039, US-040, US-041
  └─ US-048 (ドキュメント整備)
```

---

## 6. リスク管理

### 高リスク
- **RISK-001**: Cognito統合の複雑性
  - 対策: Sprint 1で早期に実装・検証
  - 担当: バックエンド・フロントエンド両チーム

- **RISK-002**: AWSコスト超過
  - 対策: 定期的なコストモニタリング、無料枠確認
  - 担当: インフラ担当

### 中リスク
- **RISK-003**: テストカバレッジ目標未達
  - 対策: Sprint 4で集中的にテスト実装
  - 担当: 全メンバー

- **RISK-004**: パフォーマンス問題
  - 対策: 早期にLighthouse計測、ボトルネック特定
  - 担当: フロントエンド担当

---

## 7. 完了の定義（Definition of Done）

各ユーザーストーリーは以下を満たした時に「完了」とみなす：

1. **実装**: コードが実装され、動作する
2. **テスト**: ユニットテストが作成され、パスする
3. **Lint**: Biomeでlintエラーがない
4. **レビュー**: コードレビューが完了している
5. **マージ**: mainブランチにマージされている
6. **ドキュメント**: 必要に応じてドキュメント更新
7. **受け入れ基準**: 全ての受け入れ基準を満たしている

---

## 8. 見積もり

### ストーリーポイント合計
- **Sprint 0**: 19ポイント
- **Sprint 1**: 34ポイント
- **Sprint 2**: 38ポイント
- **Sprint 3**: 35ポイント
- **Sprint 4**: 62ポイント
- **合計**: 188ポイント

### タイムライン
- **Sprint 0**: Week 0（準備期間）
- **Sprint 1**: Week 1-2（2週間）
- **Sprint 2**: Week 3-4（2週間）
- **Sprint 3**: Week 5-6（2週間）
- **Sprint 4**: Week 7-8（2週間）
- **合計**: 約8週間

---

## 9. 優先順位マトリクス

| 優先度 | ユーザーストーリー数 | 合計ポイント |
|-------|-----------------|------------|
| P0    | 30              | 135        |
| P1    | 14              | 44         |
| P2    | 4               | 9          |
| P3    | 0               | 0          |

---

## 10. 次のステップ

実装計画フェーズが完了しました。次のステップはissue作成フェーズです。

各ユーザーストーリーをGitHub Issueとして作成し、GitHub Projectで管理します。