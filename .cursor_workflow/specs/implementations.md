# 実装計画書（改訂版）

前段階の`.cursor_workflow/specs/design.md`を読み込みました。

## 改訂履歴
- 2025-10-09: backend、frontend、infraを同時並行で進められるように再編成

## 1. 実装方針

### 1.1 同時並行開発の原則
- **Backend、Frontend、Infraを独立して同時進行可能にする**
- **APIの繋ぎこみは統合フェーズで実施する**
- **各層でモックやスタブを活用して独立して開発を進める**

### 1.2 実装手順
以下の手順で実装を開始する：
1. issueを実行する前にはmainブランチに切り替える
2. mainブランチを最新化(pull)する
3. issue用のブランチを切る
4. issue用のブランチに切り替える
5. 実装を開始する前に実装方針を考えて該当issueにコメントを実施する
   - **PowerShellの場合**: `.\.github\scripts\gh-issue-comment.ps1 -IssueNumber <issue番号> -Body "コメント本文"`
   - **Git Bash/WSL/Windows Terminalの場合**: `gh issue comment <issue番号> --body "コメント本文"`
   - 注意: PowerShellで直接`gh issue comment`を使用すると日本語が文字化けするため、必ずヘルパースクリプトを使用すること
6. ユーザから実装方針OKをもらえたら実装を開始する
   - ファイル単位で作成・更新・削除をした場合にgit commitすること
7. 実装終了後にPRを出す
   - PRコメントにはissue番号(#1)を記載する
8. Mergeはユーザが手動で実施する

### 1.3 開発手法
- **アジャイル・スクラム開発**を採用
- フェーズごとに実装（従来のスプリントを再編成）
- MVP（Minimum Viable Product）を第1優先として実装

### 1.4 優先順位付け
- **P0 (Critical)**: MVPに必須の機能
- **P1 (High)**: 早期リリースに必要な機能
- **P2 (Medium)**: リリース後に追加可能な機能

### 1.5 完了の定義
- コード実装、ユニットテスト、レビュー完了、mainブランチマージ

---

## 2. フェーズ計画

### Phase 0: プロジェクト基盤（完了）
**目標**: モノレポ構成と基本設定を完了する  
**状態**: ✅ 完了済み

完了済みタスク：
- ✅ US-001: モノレポ初期設定
- ✅ US-002: Biome設定
- ✅ US-003: バックエンド基本構成
- ✅ US-004: Prisma初期設定（作業中 → 完了予定）

---

### Phase 1: 各層の基盤構築（並列実行可能）
**目標**: Backend、Frontend、Infraの基盤を独立して構築する  
**並列実行**: ✅ 可能

#### Phase 1-A: Backend基盤構築
- US-004: Prisma初期設定（作業中）
- US-014: RDS開発環境構築
- US-026: ポイント計算ユーティリティ実装
- US-030: 期間計算ユーティリティ実装

#### Phase 1-B: Frontend基盤構築
- US-005: フロントエンド基本構成
- US-006: shadcn/ui導入

#### Phase 1-C: Infra基盤構築
- US-007: AWS Cognito User Pool作成
- US-039: AWS CDK Database Stack実装
- US-040: AWS CDK Backend Stack実装
- US-041: AWS CDK Frontend Stack実装

**依存関係**: なし（各層独立して実行可能）

---

### Phase 2: バックエンドAPI実装（並列実行可能）
**目標**: tRPCルーターとビジネスロジックを実装する  
**並列実行**: ✅ 可能（各APIルーターは独立）

#### Phase 2-A: 認証API
- US-008: Cognito JWT検証実装
- US-013: 認証ルーターAPI実装

#### Phase 2-B: チーム管理API
- US-015: チーム作成API実装（招待コード生成含む）
- US-016: チーム参加API実装
- US-017: チーム情報取得API実装

#### Phase 2-C: 家事管理API
- US-019: 家事リスト取得API実装
- US-020: ストレス度一括設定API実装
- US-022: 家事追加API実装
- US-023: 家事編集API実装

#### Phase 2-D: 家事記録API
- US-027: 家事記録API実装
- US-034: 家事記録履歴取得API実装

#### Phase 2-E: ダッシュボードAPI
- US-031: ランキング取得API実装
- US-032: 貢献度取得API実装

**依存関係**: Phase 1-A完了後に開始可能

---

### Phase 3: フロントエンド画面実装（並列実行可能、モック使用）
**目標**: 各画面をモックデータまたはMSWで実装する  
**並列実行**: ✅ 可能（APIに依存せず、モックで開発）

#### Phase 3-A: 認証画面
- US-009: フロントエンドAmplify統合
- US-010: ユーザー登録画面
- US-011: メール確認画面
- US-012: ログイン画面

#### Phase 3-B: チームセットアップ画面
- US-018: チームセットアップ画面

#### Phase 3-C: オンボーディング・家事管理画面
- US-021: オンボーディング画面
- US-024: ホーム画面（家事リスト表示）
- US-025: 家事管理画面

#### Phase 3-D: 家事記録機能
- US-029: Zustandストア実装（UIステート）
- US-028: 家事記録モーダル実装

#### Phase 3-E: ダッシュボード画面
- US-033: ダッシュボード画面

**依存関係**: Phase 1-B完了後に開始可能（APIなしでモック使用）

---

### Phase 4: CI/CD構築（並列実行可能）
**目標**: GitHub ActionsでCI/CDパイプラインを構築する  
**並列実行**: ✅ 可能

#### Phase 4-A: CI構築
- US-037: GitHub Actions CI設定（バックエンド）
- US-038: GitHub Actions CI設定（フロントエンド）

#### Phase 4-B: CD構築
- US-042: GitHub Actions CD設定（バックエンド）
- US-043: GitHub Actions CD設定（フロントエンド）

**依存関係**: Phase 1完了後に開始可能

---

### Phase 5: API統合とテスト
**目標**: フロントエンドとバックエンドを接続し、E2Eテストを実施する  
**並列実行**: ❌ 順次実行

#### Phase 5-A: API統合
- フロントエンドのモックをtRPC実装に置き換え
- 認証フロー統合テスト
- チーム管理統合テスト
- 家事管理統合テスト
- 家事記録統合テスト
- ダッシュボード統合テスト

#### Phase 5-B: テスト実装
- US-035: バックエンドユニットテスト実装
- US-036: フロントエンドユニットテスト実装

#### Phase 5-C: 品質向上
- US-044: エラーハンドリング実装
- US-045: レスポンシブデザイン対応
- US-046: パフォーマンス最適化

**依存関係**: Phase 2、Phase 3完了後に開始

---

### Phase 6: 本番デプロイ
**目標**: 本番環境にデプロイし、動作確認を完了する  
**並列実行**: ❌ 順次実行

- US-047: 本番環境デプロイ
- US-048: ドキュメント整備

**依存関係**: Phase 5完了後に開始

---

## 3. ユーザーストーリー詳細

---

### 【Phase 0: 完了済み】

#### US-001: モノレポ初期設定
**状態**: ✅ 完了  
**Epic**: プロジェクト基盤構築  
**優先度**: P0

---

#### US-002: Biome設定
**状態**: ✅ 完了  
**Epic**: プロジェクト基盤構築  
**優先度**: P0

---

#### US-003: バックエンド基本構成
**状態**: ✅ 完了  
**Epic**: プロジェクト基盤構築  
**優先度**: P0

---

### 【Phase 1-A: Backend基盤構築】

#### US-004: Prisma初期設定
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 1-B, 1-Cと同時実行可能

**ユーザーストーリー**:
開発者として、Prismaを使用してデータベーススキーマを管理したい。そうすることで、型安全なデータベース操作ができる。

**受け入れ基準**:
- [ ] prisma/schema.prisma作成
- [ ] 全5テーブル（User, Team, Chore, UserChoreStress, ChoreLog）定義
- [ ] PostgreSQLにマイグレーション実行
- [ ] Prisma Clientが生成される

**技術タスク**:
1. Prismaインストール
2. `npx prisma init`実行
3. schema.prisma作成（設計書通り）
4. ローカルPostgreSQL起動
5. `npx prisma migrate dev`実行
6. `npx prisma generate`実行
7. lib/prisma.ts作成（Prismaクライアント）

---

#### US-014: RDS開発環境構築
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 1-B, 1-Cと同時実行可能

**ユーザーストーリー**:
開発者として、ローカル開発用のPostgreSQLデータベースをセットアップしたい。そうすることで、開発環境で動作確認できる。

**受け入れ基準**:
- [ ] ローカルPostgreSQLインストール（Docker推奨）
- [ ] kazikashikaデータベース作成
- [ ] Prismaマイグレーション実行
- [ ] 接続確認

**技術タスク**:
1. Docker Compose作成（PostgreSQL）
2. データベース作成
3. DATABASE_URL設定
4. `npx prisma migrate dev`実行
5. Prisma Studioで確認

---

#### US-026: ポイント計算ユーティリティ実装
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 2  
**並列実行**: ✅ Phase 1-B, 1-Cと同時実行可能

**ユーザーストーリー**:
バックエンド開発者として、ポイント計算ロジックを実装したい。そうすることで、正確なポイントを計算できる。

**受け入れ基準**:
- [ ] utils/pointCalculator.ts作成
- [ ] calculatePoints関数実装
- [ ] バリデーション（時間: 1〜999、ストレス度: 1〜5）
- [ ] ユニットテスト作成（カバレッジ100%）

**技術タスク**:
1. utils/pointCalculator.ts作成
2. calculatePoints実装（time × stress）
3. バリデーション実装
4. エラーハンドリング
5. テストケース作成（正常系・異常系）

---

#### US-030: 期間計算ユーティリティ実装
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 2  
**並列実行**: ✅ Phase 1-B, 1-Cと同時実行可能

**ユーザーストーリー**:
バックエンド開発者として、期間計算ロジックを実装したい。そうすることで、ランキングを期間でフィルタできる。

**受け入れ基準**:
- [ ] utils/dateRange.ts作成
- [ ] getDateRange関数実装
- [ ] 「今週」= 過去7日間
- [ ] 「今月」= 当月1日から本日
- [ ] ユニットテスト作成

**技術タスク**:
1. utils/dateRange.ts作成
2. getDateRange実装（week / month）
3. 日付計算ロジック実装
4. テストケース作成

---

### 【Phase 1-B: Frontend基盤構築】

#### US-005: フロントエンド基本構成
**Epic**: プロジェクト基盤構築  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 1-A, 1-Cと同時実行可能

**ユーザーストーリー**:
開発者として、React + Viteのフロントエンド環境を構築したい。そうすることで、モダンなSPAを開発できる。

**受け入れ基準**:
- [ ] Vite + Reactプロジェクトが起動する
- [ ] TypeScript設定完了
- [ ] Tailwind CSS設定完了
- [ ] React Routerの基本設定完了
- [ ] tRPCクライアント設定完了（モック使用可能）

**技術タスク**:
1. `npm create vite@latest`実行
2. React + TypeScript選択
3. Tailwind CSSインストール・設定
4. React Routerインストール・設定
5. tRPC Clientインストール・設定
6. src/app/routes.tsx作成
7. src/lib/trpc.ts作成（モックまたはスタブ）
8. 開発サーバー起動確認

---

#### US-006: shadcn/ui導入
**Epic**: プロジェクト基盤構築  
**優先度**: P1  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 1-A, 1-Cと同時実行可能

**ユーザーストーリー**:
開発者として、shadcn/uiを導入してUIコンポーネントを使用したい。そうすることで、美しいUIを効率的に構築できる。

**受け入れ基準**:
- [ ] shadcn/ui初期設定完了
- [ ] 基本コンポーネント（Button, Input, Dialog等）追加
- [ ] components/ui/ディレクトリ作成
- [ ] サンプルページで動作確認

**技術タスク**:
1. `npx shadcn-ui@latest init`実行
2. components.json設定
3. Button、Input、Dialog、Card等の基本コンポーネント追加
4. サンプルページ作成して動作確認

---

### 【Phase 1-C: Infra基盤構築】

#### US-007: AWS Cognito User Pool作成
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 1-A, 1-Bと同時実行可能

**ユーザーストーリー**:
開発者として、AWS Cognito User Poolを作成したい。そうすることで、ユーザー認証機能を提供できる。

**受け入れ基準**:
- [ ] Cognito User Pool作成（CDKまたはコンソール）
- [ ] User Pool Clientアプリ作成
- [ ] パスワードポリシー設定
- [ ] メール検証設定
- [ ] User Pool IDとClient IDを環境変数に設定

**技術タスク**:
1. infra/lib/cognito-stack.ts作成
2. User Pool設定（パスワードポリシー、メール検証等）
3. User Pool Client作成
4. CDKでデプロイ（またはコンソールで作成）
5. 出力されたIDを.envに設定

---

#### US-039: AWS CDK Database Stack実装
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 1-A, 1-Bと同時実行可能

**ユーザーストーリー**:
開発者として、RDSをCDKでデプロイしたい。そうすることで、本番環境のデータベースを構築できる。

**受け入れ基準**:
- [ ] infra/lib/database-stack.ts作成
- [ ] VPC設定
- [ ] RDS PostgreSQL設定（db.t3.micro）
- [ ] セキュリティグループ設定
- [ ] `cdk synth`でエラーなし

**技術タスク**:
1. infra/lib/database-stack.ts作成
2. VPC定義（2AZ、NAT Gateway 1つ）
3. SecurityGroup定義
4. DatabaseInstance定義
5. Secrets Manager連携
6. `cdk synth`で確認

**注意**: デプロイは後のフェーズで実施

---

#### US-040: AWS CDK Backend Stack実装
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 1-A, 1-Bと同時実行可能

**ユーザーストーリー**:
開発者として、Lambda + API GatewayをCDKでデプロイしたい。そうすることで、バックエンドAPIを公開できる。

**受け入れ基準**:
- [ ] infra/lib/backend-stack.ts作成
- [ ] Lambda関数定義
- [ ] API Gateway設定
- [ ] 環境変数設定（DATABASE_URL, COGNITO等）
- [ ] `cdk synth`でエラーなし

**技術タスク**:
1. infra/lib/backend-stack.ts作成
2. Lambda Function定義
3. API Gateway HTTP API定義
4. Lambda統合設定
5. CORS設定
6. 環境変数設定
7. VPC接続設定
8. `cdk synth`で確認

**注意**: デプロイは後のフェーズで実施

---

#### US-041: AWS CDK Frontend Stack実装
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 1-A, 1-Bと同時実行可能

**ユーザーストーリー**:
開発者として、S3 + CloudFrontをCDKでデプロイしたい。そうすることで、フロントエンドを公開できる。

**受け入れ基準**:
- [ ] infra/lib/frontend-stack.ts作成
- [ ] S3バケット設定
- [ ] CloudFront Distribution設定
- [ ] SPA対応（エラーページ設定）
- [ ] `cdk synth`でエラーなし

**技術タスク**:
1. infra/lib/frontend-stack.ts作成
2. S3 Bucket定義（静的ホスティング）
3. CloudFront Distribution定義
4. エラーページ設定（404 → index.html）
5. BucketDeployment定義
6. `cdk synth`で確認

**注意**: デプロイは後のフェーズで実施

---

### 【Phase 2-A: 認証API】

#### US-008: Cognito JWT検証実装
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-B, 2-C, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、Cognitoから発行されたJWTを検証したい。そうすることで、認証済みユーザーのみAPIアクセスを許可できる。

**受け入れ基準**:
- [ ] aws-jwt-verifyパッケージ導入
- [ ] utils/cognito.ts作成
- [ ] verifyCognitoToken関数実装
- [ ] tRPCコンテキストでJWT検証
- [ ] protectedProcedure実装

**技術タスク**:
1. aws-jwt-verifyインストール
2. utils/cognito.ts作成
3. verifyCognitoToken関数実装
4. context.tsでJWT検証実装
5. trpc.tsでprotectedProcedure実装
6. テストケース作成

---

#### US-013: 認証ルーターAPI実装
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-B, 2-C, 2-D, 2-Eと同時実行可能  
**依存関係**: US-008完了後

**ユーザーストーリー**:
バックエンド開発者として、認証関連のtRPC APIを実装したい。そうすることで、ユーザー情報の管理ができる。

**受け入れ基準**:
- [ ] trpc/routers/auth.ts作成
- [ ] auth.createUser実装
- [ ] auth.me実装
- [ ] auth.updateUsername実装
- [ ] ルートルーターに統合

**技術タスク**:
1. trpc/routers/auth.ts作成
2. createUser mutation実装（DB登録）
3. me query実装（ユーザー情報取得）
4. updateUsername mutation実装
5. appRouterに統合
6. ユニットテスト作成

---

### 【Phase 2-B: チーム管理API】

#### US-015: チーム作成API実装
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 2-A, 2-C, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、チーム作成APIを実装したい。そうすることで、ユーザーがチームを作成できる。

**受け入れ基準**:
- [ ] trpc/routers/team.ts作成
- [ ] utils/inviteCode.ts作成（招待コード生成）
- [ ] team.create実装
- [ ] 招待コード生成（8文字英数字）
- [ ] デフォルト家事10種類を自動作成
- [ ] ユーザーのteamIdを更新
- [ ] ユニットテスト作成

**技術タスク**:
1. trpc/routers/team.ts作成
2. utils/inviteCode.ts作成（nanoid使用）
3. team.create mutation実装
4. デフォルト家事リスト定義
5. チーム作成時にChore10件作成
6. ユーザーのteamId更新
7. テストケース作成

---

#### US-016: チーム参加API実装
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-A, 2-C, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、チーム参加APIを実装したい。そうすることで、ユーザーが招待コードでチームに参加できる。

**受け入れ基準**:
- [ ] team.join実装
- [ ] 招待コードでチーム検索
- [ ] ユーザーのteamIdを更新
- [ ] 既にチーム所属の場合はエラー
- [ ] ユニットテスト作成

**技術タスク**:
1. team.join mutation実装
2. inviteCodeでTeam検索
3. 既存チーム所属チェック
4. ユーザーのteamId更新
5. エラーハンドリング
6. テストケース作成

---

#### US-017: チーム情報取得API実装
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 2  
**並列実行**: ✅ Phase 2-A, 2-C, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、チーム情報取得APIを実装したい。そうすることで、チーム名や招待コードを表示できる。

**受け入れ基準**:
- [ ] team.get実装
- [ ] team.getMembers実装
- [ ] チーム所属チェック
- [ ] ユニットテスト作成

**技術タスク**:
1. team.get query実装
2. team.getMembers query実装
3. teamIdチェック
4. テストケース作成

---

### 【Phase 2-C: 家事管理API】

#### US-019: 家事リスト取得API実装
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-A, 2-B, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、家事リスト取得APIを実装したい。そうすることで、チームの家事とユーザーのストレス度を表示できる。

**受け入れ基準**:
- [ ] trpc/routers/chore.ts作成
- [ ] chore.list実装
- [ ] チームの家事リスト取得
- [ ] ユーザーのストレス度を含める
- [ ] ユニットテスト作成

**技術タスク**:
1. trpc/routers/chore.ts作成
2. chore.list query実装
3. Choreをteamでフィルタ
4. UserChoreStressをincludeで取得
5. レスポンス整形
6. テストケース作成

---

#### US-020: ストレス度一括設定API実装
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-A, 2-B, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、ストレス度一括設定APIを実装したい。そうすることで、オンボーディング時に全家事のストレス度を保存できる。

**受け入れ基準**:
- [ ] chore.setStressLevels実装
- [ ] 複数のストレス度を一括upsert
- [ ] バリデーション（1〜5）
- [ ] ユニットテスト作成

**技術タスク**:
1. chore.setStressLevels mutation実装
2. 配列で複数のストレス度を受け取る
3. upsertでUserChoreStress作成・更新
4. Zodバリデーション（1〜5）
5. テストケース作成

---

#### US-022: 家事追加API実装
**Epic**: 家事管理  
**優先度**: P1  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-A, 2-B, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、家事追加APIを実装したい。そうすることで、ユーザーがカスタム家事を追加できる。

**受け入れ基準**:
- [ ] chore.create実装
- [ ] 家事名とストレス度を受け取る
- [ ] Choreレコード作成
- [ ] UserChoreStressレコード作成
- [ ] ユニットテスト作成

**技術タスク**:
1. chore.create mutation実装
2. Chore作成（isDefault: false）
3. UserChoreStress作成
4. Zodバリデーション
5. テストケース作成

---

#### US-023: 家事編集API実装
**Epic**: 家事管理  
**優先度**: P1  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-A, 2-B, 2-D, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、家事編集APIを実装したい。そうすることで、家事名やストレス度を変更できる。

**受け入れ基準**:
- [ ] chore.updateName実装
- [ ] chore.updateStressLevel実装
- [ ] チームの家事かチェック
- [ ] ユニットテスト作成

**技術タスク**:
1. chore.updateName mutation実装
2. chore.updateStressLevel mutation実装
3. teamIdでアクセス制御
4. テストケース作成

---

### 【Phase 2-D: 家事記録API】

#### US-027: 家事記録API実装
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 2-A, 2-B, 2-C, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後（US-026実装済み）

**ユーザーストーリー**:
バックエンド開発者として、家事記録APIを実装したい。そうすることで、家事完了記録とポイント計算ができる。

**受け入れ基準**:
- [ ] trpc/routers/choreLog.ts作成
- [ ] choreLog.create実装
- [ ] ストレス度取得
- [ ] ポイント計算（calculatePoints使用）
- [ ] ChoreLogレコード作成
- [ ] ユニットテスト作成

**技術タスク**:
1. trpc/routers/choreLog.ts作成
2. choreLog.create mutation実装
3. UserChoreStressからストレス度取得
4. calculatePoints呼び出し
5. ChoreLog作成
6. レスポンスに獲得ポイント含める
7. テストケース作成

---

#### US-034: 家事記録履歴取得API実装
**Epic**: 家事記録  
**優先度**: P2  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-A, 2-B, 2-C, 2-Eと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
バックエンド開発者として、家事記録履歴取得APIを実装したい。そうすることで、過去の記録を閲覧できる。

**受け入れ基準**:
- [ ] choreLog.list実装
- [ ] 期間フィルタリング（オプション）
- [ ] ユーザー指定（オプション）
- [ ] チームメンバーのみアクセス可能
- [ ] ユニットテスト作成

**技術タスク**:
1. choreLog.list query実装
2. 期間・ユーザーフィルタ実装
3. チームメンバーチェック
4. ChoreLogとChore取得
5. 日付降順ソート
6. テストケース作成

---

### 【Phase 2-E: ダッシュボードAPI】

#### US-031: ランキング取得API実装
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 2-A, 2-B, 2-C, 2-Dと同時実行可能  
**依存関係**: Phase 1-A完了後（US-030実装済み）

**ユーザーストーリー**:
バックエンド開発者として、ランキング取得APIを実装したい。そうすることで、チームメンバーのポイントランキングを表示できる。

**受け入れ基準**:
- [ ] trpc/routers/dashboard.ts作成
- [ ] dashboard.getRanking実装
- [ ] 期間フィルタリング（今週・今月）
- [ ] チームメンバーのポイント集計
- [ ] ランキングソート
- [ ] ユニットテスト作成

**技術タスク**:
1. trpc/routers/dashboard.ts作成
2. dashboard.getRanking query実装
3. getDateRange呼び出し
4. User + ChoreLog取得（include）
5. ポイント集計・ソート
6. ランク付け
7. テストケース作成

---

#### US-032: 貢献度取得API実装
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 2-A, 2-B, 2-C, 2-Dと同時実行可能  
**依存関係**: Phase 1-A完了後（US-030実装済み）

**ユーザーストーリー**:
バックエンド開発者として、貢献度取得APIを実装したい。そうすることで、円グラフで貢献度を表示できる。

**受け入れ基準**:
- [ ] dashboard.getContribution実装
- [ ] 期間フィルタリング
- [ ] チームメンバーのポイント集計
- [ ] 貢献度割合計算
- [ ] ユニットテスト作成

**技術タスク**:
1. dashboard.getContribution query実装
2. getDateRange呼び出し
3. User + ChoreLog取得
4. ポイント集計
5. 割合計算（小数点第1位）
6. テストケース作成

---

### 【Phase 3-A: 認証画面】

#### US-009: フロントエンドAmplify統合
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 3-B, 3-C, 3-D, 3-Eと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
フロントエンド開発者として、AWS AmplifyでCognito認証を統合したい。そうすることで、ユーザー登録・ログイン機能を実装できる。

**受け入れ基準**:
- [ ] aws-amplifyパッケージ導入
- [ ] lib/amplify.ts作成
- [ ] Cognito設定
- [ ] features/auth/hooks/useAuth.ts作成
- [ ] 認証状態管理実装

**技術タスク**:
1. aws-amplifyインストール
2. lib/amplify.ts作成（Amplify.configure）
3. features/auth/hooks/useAuth.ts作成
4. signUp、confirmSignUp、signIn、signOut関数実装
5. 認証状態管理（Zustandまたはcontext）
6. ProtectedRouteコンポーネント作成

---

#### US-010: ユーザー登録画面
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 3-B, 3-C, 3-D, 3-Eと同時実行可能  
**依存関係**: US-009完了後

**ユーザーストーリー**:
新規ユーザーとして、メールアドレスとパスワードでアカウントを登録したい。そうすることで、アプリを使い始めることができる。

**受け入れ基準**:
- [ ] /registerページ作成
- [ ] フォーム（ユーザー名、メール、パスワード）実装
- [ ] React Hook Form + Zod バリデーション
- [ ] Amplify signUp()呼び出し
- [ ] 成功時、確認画面へ遷移
- [ ] エラーハンドリング

**技術タスク**:
1. features/auth/pages/RegisterPage.tsx作成
2. React Hook Form設定
3. Zodスキーマ定義
4. useAuth hookを使用してsignUp実行
5. エラーハンドリング実装
6. 成功時に/confirm-emailへ遷移

---

#### US-011: メール確認画面
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 3-B, 3-C, 3-D, 3-Eと同時実行可能  
**依存関係**: US-009完了後

**ユーザーストーリー**:
新規ユーザーとして、メールで受信した確認コードを入力したい。そうすることで、メールアドレスを検証できる。

**受け入れ基準**:
- [ ] /confirm-emailページ作成
- [ ] 確認コード入力フォーム実装
- [ ] Amplify confirmSignUp()呼び出し
- [ ] 成功時、tRPC auth.createUserでDB登録（モック可）
- [ ] /app/team-setupへ遷移
- [ ] エラーハンドリング

**技術タスク**:
1. features/auth/pages/ConfirmEmailPage.tsx作成
2. 確認コード入力フォーム実装
3. confirmSignUp実行
4. 成功時にcurrentUserのSubを取得
5. tRPC auth.createUserでDB登録（モック可）
6. /app/team-setupへ遷移

**注意**: APIが未実装の場合はモックで対応

---

#### US-012: ログイン画面
**Epic**: 認証基盤  
**優先度**: P0  
**ストーリーポイント**: 3  
**並列実行**: ✅ Phase 3-B, 3-C, 3-D, 3-Eと同時実行可能  
**依存関係**: US-009完了後

**ユーザーストーリー**:
既存ユーザーとして、メールアドレスとパスワードでログインしたい。そうすることで、アプリを使用できる。

**受け入れ基準**:
- [ ] /loginページ作成
- [ ] フォーム（メール、パスワード）実装
- [ ] Amplify signIn()呼び出し
- [ ] 成功時、適切なページへリダイレクト
- [ ] エラーハンドリング

**技術タスク**:
1. features/auth/pages/LoginPage.tsx作成
2. React Hook Form設定
3. useAuth hookを使用してsignIn実行
4. 成功時にtRPC auth.meでユーザー情報取得（モック可）
5. チーム所属状況に応じてリダイレクト
6. エラーハンドリング実装

**注意**: APIが未実装の場合はモックで対応

---

### 【Phase 3-B: チームセットアップ画面】

#### US-018: チームセットアップ画面
**Epic**: チーム管理  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 3-A, 3-C, 3-D, 3-Eと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
新規ユーザーとして、チームを作成または参加したい。そうすることで、チームメンバーと家事を共有できる。

**受け入れ基準**:
- [ ] /app/team-setupページ作成
- [ ] チーム作成フォーム実装
- [ ] チーム参加フォーム実装
- [ ] tRPC team.create / team.join呼び出し（モック可）
- [ ] 成功時、オンボーディングへ遷移
- [ ] エラーハンドリング

**技術タスク**:
1. features/auth/pages/TeamSetupPage.tsx作成
2. チーム作成・参加の切り替えUI実装
3. チーム名入力フォーム（作成時）
4. 招待コード入力フォーム（参加時）
5. tRPC呼び出し（モック可）
6. 成功時に/app/onboardingへ遷移

**注意**: APIが未実装の場合はモックで対応

---

### 【Phase 3-C: オンボーディング・家事管理画面】

#### US-021: オンボーディング画面
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 8  
**並列実行**: ✅ Phase 3-A, 3-B, 3-D, 3-Eと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
新規ユーザーとして、デフォルト家事に対するストレス度を設定したい。そうすることで、自分に合ったポイント計算ができる。

**受け入れ基準**:
- [ ] /app/onboardingページ作成
- [ ] 家事を1つずつ表示
- [ ] ストレス度選択UI（1〜5）
- [ ] プログレスバー表示
- [ ] tRPC chore.listで家事取得（モック可）
- [ ] tRPC chore.setStressLevels呼び出し（モック可）
- [ ] 完了時、/app/homeへ遷移

**技術タスク**:
1. features/onboarding/pages/OnboardingPage.tsx作成
2. chore.list呼び出し（モック可）
3. 1件ずつ家事表示ロジック実装
4. ストレス度選択UI（ボタンまたはスライダー）
5. プログレスバー実装（例: 3/10）
6. 全完了時にsetStressLevels呼び出し（モック可）
7. /app/homeへ遷移

**注意**: APIが未実装の場合はモックで対応

---

#### US-024: ホーム画面（家事リスト表示）
**Epic**: 家事管理  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 3-A, 3-B, 3-D, 3-Eと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
ユーザーとして、家事リストを表示したい。そうすることで、完了すべき家事を確認できる。

**受け入れ基準**:
- [ ] /app/homeページ作成
- [ ] tRPC chore.list呼び出し（モック可）
- [ ] 家事リスト表示
- [ ] 各家事に「完了」ボタン表示
- [ ] ローディング状態表示

**技術タスク**:
1. features/chores/pages/HomePage.tsx作成
2. tRPC chore.list呼び出し（モック可）
3. ChoreListコンポーネント作成
4. 各家事カード表示
5. 完了ボタン実装（モーダル表示準備）
6. ローディング・エラー表示

**注意**: APIが未実装の場合はモックで対応

---

#### US-025: 家事管理画面
**Epic**: 家事管理  
**優先度**: P1  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 3-A, 3-B, 3-D, 3-Eと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
ユーザーとして、家事を追加・編集したい。そうすることで、家庭に合わせた家事リストを作成できる。

**受け入れ基準**:
- [ ] /app/choresページ作成
- [ ] 家事リスト表示
- [ ] 「新しい家事を追加」ボタン
- [ ] 家事追加モーダル実装
- [ ] 家事編集モーダル実装
- [ ] tRPC呼び出し（モック可）

**技術タスク**:
1. features/chores/pages/ChoresManagementPage.tsx作成
2. 家事リスト表示
3. 家事追加モーダルコンポーネント作成
4. 家事編集モーダルコンポーネント作成
5. tRPC chore.create / updateName / updateStressLevel呼び出し（モック可）
6. キャッシュ無効化（React Query）

**注意**: APIが未実装の場合はモックで対応

---

### 【Phase 3-D: 家事記録機能】

#### US-029: Zustandストア実装（UIステート）
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 2  
**並列実行**: ✅ Phase 3-A, 3-B, 3-C, 3-Eと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
開発者として、モーダルの開閉状態を管理したい。そうすることで、UI状態を適切に管理できる。

**受け入れ基準**:
- [ ] stores/uiStore.ts作成
- [ ] isChoreLogModalOpen状態管理
- [ ] selectedChoreId状態管理
- [ ] openChoreLogModal、closeChoreLogModal実装

**技術タスク**:
1. Zustandインストール
2. stores/uiStore.ts作成
3. モーダル開閉状態管理
4. 選択された家事ID管理
5. ホーム画面でストア使用

---

#### US-028: 家事記録モーダル実装
**Epic**: 家事記録  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 3-A, 3-B, 3-C, 3-Eと同時実行可能  
**依存関係**: US-029完了後

**ユーザーストーリー**:
ユーザーとして、家事完了時に時間を入力したい。そうすることで、ポイントを獲得できる。

**受け入れ基準**:
- [ ] 時間入力モーダルコンポーネント作成
- [ ] 選択肢ボタン（15分、30分、45分、60分）実装
- [ ] 自由入力欄（1〜999分）実装
- [ ] tRPC choreLog.create呼び出し（モック可）
- [ ] 獲得ポイントをトースト通知表示

**技術タスク**:
1. features/logs/components/ChoreLogModal.tsx作成
2. Dialog（shadcn/ui）使用
3. 時間選択ボタン実装
4. 自由入力欄実装（数値バリデーション）
5. tRPC choreLog.create呼び出し（モック可）
6. sonnerでトースト通知実装
7. キャッシュ無効化

**注意**: APIが未実装の場合はモックで対応

---

### 【Phase 3-E: ダッシュボード画面】

#### US-033: ダッシュボード画面
**Epic**: ダッシュボード  
**優先度**: P0  
**ストーリーポイント**: 8  
**並列実行**: ✅ Phase 3-A, 3-B, 3-C, 3-Dと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
ユーザーとして、チームの貢献度とランキングを確認したい。そうすることで、家事分担のバランスを把握できる。

**受け入れ基準**:
- [ ] /app/dashboardページ作成
- [ ] 期間選択タブ（今週・今月）実装
- [ ] 円グラフ表示（Recharts）
- [ ] ランキングリスト表示
- [ ] tRPC dashboard.getRanking / getContribution呼び出し（モック可）
- [ ] レスポンシブデザイン

**技術タスク**:
1. features/dashboard/pages/DashboardPage.tsx作成
2. Rechartsインストール
3. 期間選択タブ実装
4. 円グラフコンポーネント作成（PieChart）
5. ランキングリストコンポーネント作成
6. tRPC呼び出し（モック可）
7. ローディング・エラー表示
8. レスポンシブ対応

**注意**: APIが未実装の場合はモックで対応

---

### 【Phase 4-A: CI構築】

#### US-037: GitHub Actions CI設定（バックエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 4-Bと同時実行可能  
**依存関係**: Phase 1-A完了後

**ユーザーストーリー**:
開発者として、バックエンドのCIを構築したい。そうすることで、コード品質を自動チェックできる。

**受け入れ基準**:
- [ ] .github/workflows/backend-ci.yml作成
- [ ] Lint、Test、Coverage実行
- [ ] PRでCI自動実行
- [ ] mainブランチプッシュでCI実行

**技術タスク**:
1. .github/workflows/backend-ci.yml作成
2. Lintステップ追加
3. Testステップ追加
4. Coverageチェック追加
5. パス指定（backend/**）
6. 動作確認

---

#### US-038: GitHub Actions CI設定（フロントエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 4-Aと同時実行可能  
**依存関係**: Phase 1-B完了後

**ユーザーストーリー**:
開発者として、フロントエンドのCIを構築したい。そうすることで、コード品質を自動チェックできる。

**受け入れ基準**:
- [ ] .github/workflows/frontend-ci.yml作成
- [ ] Lint、Test、Coverage実行
- [ ] PRでCI自動実行
- [ ] mainブランチプッシュでCI実行

**技術タスク**:
1. .github/workflows/frontend-ci.yml作成
2. Lintステップ追加
3. Testステップ追加
4. Coverageチェック追加
5. パス指定（frontend/**）
6. 動作確認

---

### 【Phase 4-B: CD構築】

#### US-042: GitHub Actions CD設定（バックエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P1  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 4-Aと同時実行可能  
**依存関係**: US-037、US-040完了後

**ユーザーストーリー**:
開発者として、バックエンドのCDを構築したい。そうすることで、mainブランチへのマージで自動デプロイできる。

**受け入れ基準**:
- [ ] backend-ci.ymlにdeployジョブ追加
- [ ] mainブランチのみデプロイ実行
- [ ] ビルド → CDKデプロイ
- [ ] AWS認証情報をSecretsで管理

**技術タスク**:
1. backend-ci.ymlにdeployジョブ追加
2. needs: testで依存関係設定
3. if: github.ref == 'refs/heads/main'
4. npm run build実行
5. cdk deploy BackendStack実行
6. AWS_ACCESS_KEY_IDとAWS_SECRET_ACCESS_KEYをSecretsに登録

---

#### US-043: GitHub Actions CD設定（フロントエンド）
**Epic**: CI/CD・デプロイ  
**優先度**: P1  
**ストーリーポイント**: 5  
**並列実行**: ✅ Phase 4-Aと同時実行可能  
**依存関係**: US-038、US-041完了後

**ユーザーストーリー**:
開発者として、フロントエンドのCDを構築したい。そうすることで、mainブランチへのマージで自動デプロイできる。

**受け入れ基準**:
- [ ] frontend-ci.ymlにdeployジョブ追加
- [ ] mainブランチのみデプロイ実行
- [ ] ビルド → CDKデプロイ
- [ ] 環境変数設定

**技術タスク**:
1. frontend-ci.ymlにdeployジョブ追加
2. needs: testで依存関係設定
3. if: github.ref == 'refs/heads/main'
4. 環境変数設定（VITE_API_URL等）
5. npm run build実行
6. cdk deploy FrontendStack実行

---

### 【Phase 5-A: API統合】（Phase 2とPhase 3の完了後）

**タスク**:
- [ ] フロントエンドのモックをtRPC実装に置き換え
- [ ] 認証フロー統合テスト
- [ ] チーム管理統合テスト
- [ ] 家事管理統合テスト
- [ ] 家事記録統合テスト
- [ ] ダッシュボード統合テスト

**依存関係**: Phase 2、Phase 3完了後

---

### 【Phase 5-B: テスト実装】

#### US-035: バックエンドユニットテスト実装
**Epic**: テスト・品質保証  
**優先度**: P0  
**ストーリーポイント**: 8  
**並列実行**: ✅ US-036と同時実行可能  
**依存関係**: Phase 2完了後

**ユーザーストーリー**:
開発者として、バックエンドのユニットテストを作成したい。そうすることで、コードの品質を保証できる。

**受け入れ基準**:
- [ ] Vitest設定完了
- [ ] ユーティリティ関数のテスト（pointCalculator、dateRange、inviteCode）
- [ ] tRPCルーターの統合テスト
- [ ] カバレッジ85%以上達成
- [ ] CIで自動実行

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

#### US-036: フロントエンドユニットテスト実装
**Epic**: テスト・品質保証  
**優先度**: P0  
**ストーリーポイント**: 8  
**並列実行**: ✅ US-035と同時実行可能  
**依存関係**: Phase 3完了後

**ユーザーストーリー**:
開発者として、フロントエンドのユニットテストを作成したい。そうすることで、UIコンポーネントの品質を保証できる。

**受け入れ基準**:
- [ ] Vitest + React Testing Library設定
- [ ] 主要コンポーネントのテスト作成
- [ ] カバレッジ75%以上達成
- [ ] CIで自動実行

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

### 【Phase 5-C: 品質向上】

#### US-044: エラーハンドリング実装
**Epic**: テスト・品質保証  
**優先度**: P1  
**ストーリーポイント**: 3  
**並列実行**: ✅ US-045, US-046と同時実行可能  
**依存関係**: Phase 5-A完了後

**ユーザーストーリー**:
開発者として、適切なエラーハンドリングを実装したい。そうすることで、ユーザーにわかりやすいエラーメッセージを表示できる。

**受け入れ基準**:
- [ ] バックエンドでtRPCErrorハンドリング実装
- [ ] PrismaエラーをtRPCErrorに変換
- [ ] フロントエンドでトースト通知表示
- [ ] React Query onError設定

**技術タスク**:
1. middleware/errorHandler.ts作成
2. Prismaエラーハンドリング実装
3. tRPCエラーマッピング
4. フロントエンドでQueryClient設定
5. onErrorでトースト表示
6. エラー境界（Error Boundary）実装

---

#### US-045: レスポンシブデザイン対応
**Epic**: テスト・品質保証  
**優先度**: P1  
**ストーリーポイント**: 5  
**並列実行**: ✅ US-044, US-046と同時実行可能  
**依存関係**: Phase 3完了後

**ユーザーストーリー**:
ユーザーとして、スマートフォンでも快適に使いたい。そうすることで、どのデバイスでもアプリを利用できる。

**受け入れ基準**:
- [ ] 全画面でレスポンシブ対応
- [ ] スマートフォン（375px〜）で表示確認
- [ ] タブレット（768px〜）で表示確認
- [ ] PC（1024px〜）で表示確認
- [ ] Tailwind CSSのブレークポイント使用

**技術タスク**:
1. 各ページでレスポンシブクラス追加
2. モバイルファーストで実装
3. sm:、md:、lg:ブレークポイント活用
4. グリッドレイアウト調整
5. フォントサイズ調整
6. デバイスごとに動作確認

---

#### US-046: パフォーマンス最適化
**Epic**: テスト・品質保証  
**優先度**: P2  
**ストーリーポイント**: 5  
**並列実行**: ✅ US-044, US-045と同時実行可能  
**依存関係**: Phase 3完了後

**ユーザーストーリー**:
開発者として、アプリのパフォーマンスを最適化したい。そうすることで、高速で快適なUXを提供できる。

**受け入れ基準**:
- [ ] React.lazy + Suspense でコード分割
- [ ] React Query staleTime設定
- [ ] 画像最適化
- [ ] Lighthouseスコア80以上

**技術タスク**:
1. React.lazy + Suspenseでページコンポーネント遅延読み込み
2. React Query staleTime設定
3. 画像圧縮・WebP化
4. 不要なre-render削減（useMemo、useCallback）
5. Lighthouseで計測
6. パフォーマンス改善

---

### 【Phase 6: 本番デプロイ】

#### US-047: 本番環境デプロイ
**Epic**: CI/CD・デプロイ  
**優先度**: P0  
**ストーリーポイント**: 8  
**並列実行**: ❌  
**依存関係**: Phase 5完了後

**ユーザーストーリー**:
開発者として、本番環境にデプロイしたい。そうすることで、ユーザーにアプリを提供できる。

**受け入れ基準**:
- [ ] Cognito User Pool本番環境作成
- [ ] RDS本番環境作成
- [ ] Lambda + API Gateway本番環境デプロイ
- [ ] S3 + CloudFront本番環境デプロイ
- [ ] データベースマイグレーション実行
- [ ] 動作確認完了

**技術タスク**:
1. CDK全スタックデプロイ
2. Cognito設定確認
3. RDS接続確認
4. Prismaマイグレーション実行
5. フロントエンド環境変数設定
6. 全機能動作確認
7. ドメイン設定（オプション）

---

#### US-048: ドキュメント整備
**Epic**: テスト・品質保証  
**優先度**: P2  
**ストーリーポイント**: 3  
**並列実行**: ✅  
**依存関係**: なし（いつでも実施可能）

**ユーザーストーリー**:
開発者として、ドキュメントを整備したい。そうすることで、チームメンバーが理解しやすくなる。

**受け入れ基準**:
- [ ] 各パッケージのREADME作成
- [ ] セットアップ手順記載
- [ ] 環境変数の説明
- [ ] デプロイ手順記載

**技術タスク**:
1. backend/README.md作成
2. frontend/README.md作成
3. infra/README.md作成
4. ルートREADME.md更新
5. 環境変数一覧作成
6. トラブルシューティング追加

---

## 4. フェーズ別進行計画

### 並列実行可能なフェーズ

#### フェーズグループ1（Phase 1: 基盤構築）
- **Phase 1-A**: Backend基盤（US-004, US-014, US-026, US-030）
- **Phase 1-B**: Frontend基盤（US-005, US-006）
- **Phase 1-C**: Infra基盤（US-007, US-039, US-040, US-041）

#### フェーズグループ2（Phase 2: バックエンドAPI）
- **Phase 2-A**: 認証API（US-008, US-013）
- **Phase 2-B**: チーム管理API（US-015, US-016, US-017）
- **Phase 2-C**: 家事管理API（US-019, US-020, US-022, US-023）
- **Phase 2-D**: 家事記録API（US-027, US-034）
- **Phase 2-E**: ダッシュボードAPI（US-031, US-032）

#### フェーズグループ3（Phase 3: フロントエンド画面）
- **Phase 3-A**: 認証画面（US-009, US-010, US-011, US-012）
- **Phase 3-B**: チームセットアップ画面（US-018）
- **Phase 3-C**: オンボーディング・家事管理画面（US-021, US-024, US-025）
- **Phase 3-D**: 家事記録機能（US-029, US-028）
- **Phase 3-E**: ダッシュボード画面（US-033）

#### フェーズグループ4（Phase 4: CI/CD）
- **Phase 4-A**: CI構築（US-037, US-038）
- **Phase 4-B**: CD構築（US-042, US-043）

---

## 5. 依存関係グラフ

```
Phase 0 (完了済み)
  ├─ US-001 ✅
  ├─ US-002 ✅
  └─ US-003 ✅

Phase 1 (並列実行可能)
  ├─ Phase 1-A (Backend基盤)
  │    ├─ US-004 (Prisma)
  │    ├─ US-014 (RDS開発環境)
  │    ├─ US-026 (ポイント計算)
  │    └─ US-030 (期間計算)
  │
  ├─ Phase 1-B (Frontend基盤)
  │    ├─ US-005 (Frontend基本構成)
  │    └─ US-006 (shadcn/ui)
  │
  └─ Phase 1-C (Infra基盤)
       ├─ US-007 (Cognito作成)
       ├─ US-039 (Database Stack)
       ├─ US-040 (Backend Stack)
       └─ US-041 (Frontend Stack)

Phase 2 (並列実行可能、Phase 1-A完了後)
  ├─ Phase 2-A (認証API)
  │    ├─ US-008 (JWT検証)
  │    └─ US-013 (認証ルーター)
  │
  ├─ Phase 2-B (チーム管理API)
  │    ├─ US-015 (チーム作成)
  │    ├─ US-016 (チーム参加)
  │    └─ US-017 (チーム情報)
  │
  ├─ Phase 2-C (家事管理API)
  │    ├─ US-019 (家事リスト)
  │    ├─ US-020 (ストレス度設定)
  │    ├─ US-022 (家事追加)
  │    └─ US-023 (家事編集)
  │
  ├─ Phase 2-D (家事記録API)
  │    ├─ US-027 (家事記録)
  │    └─ US-034 (記録履歴)
  │
  └─ Phase 2-E (ダッシュボードAPI)
       ├─ US-031 (ランキング)
       └─ US-032 (貢献度)

Phase 3 (並列実行可能、Phase 1-B完了後、モック使用)
  ├─ Phase 3-A (認証画面)
  │    ├─ US-009 (Amplify統合)
  │    ├─ US-010 (登録画面)
  │    ├─ US-011 (確認画面)
  │    └─ US-012 (ログイン画面)
  │
  ├─ Phase 3-B (チームセットアップ画面)
  │    └─ US-018 (チームセットアップ)
  │
  ├─ Phase 3-C (オンボーディング・家事管理画面)
  │    ├─ US-021 (オンボーディング)
  │    ├─ US-024 (ホーム画面)
  │    └─ US-025 (家事管理画面)
  │
  ├─ Phase 3-D (家事記録機能)
  │    ├─ US-029 (Zustandストア)
  │    └─ US-028 (記録モーダル)
  │
  └─ Phase 3-E (ダッシュボード画面)
       └─ US-033 (ダッシュボード)

Phase 4 (並列実行可能、Phase 1完了後)
  ├─ Phase 4-A (CI構築)
  │    ├─ US-037 (バックエンドCI)
  │    └─ US-038 (フロントエンドCI)
  │
  └─ Phase 4-B (CD構築)
       ├─ US-042 (バックエンドCD)
       └─ US-043 (フロントエンドCD)

Phase 5 (順次実行、Phase 2 & 3完了後)
  ├─ Phase 5-A: API統合
  ├─ Phase 5-B: テスト実装
  │    ├─ US-035 (バックエンドテスト)
  │    └─ US-036 (フロントエンドテスト)
  │
  └─ Phase 5-C: 品質向上
       ├─ US-044 (エラーハンドリング)
       ├─ US-045 (レスポンシブ対応)
       └─ US-046 (パフォーマンス最適化)

Phase 6 (順次実行、Phase 5完了後)
  ├─ US-047 (本番デプロイ)
  └─ US-048 (ドキュメント整備)
```

---

## 6. 開発チーム構成案

### 並列開発を実現するチーム編成

#### チーム1: Backend開発
- Phase 1-A: Backend基盤構築
- Phase 2: 全API実装（2-A〜2-E）
- Phase 5-B: バックエンドテスト

#### チーム2: Frontend開発
- Phase 1-B: Frontend基盤構築
- Phase 3: 全画面実装（3-A〜3-E）
- Phase 5-B: フロントエンドテスト

#### チーム3: Infra開発
- Phase 1-C: Infra基盤構築
- Phase 4: CI/CD構築

#### 統合チーム（全メンバー）
- Phase 5-A: API統合
- Phase 5-C: 品質向上
- Phase 6: 本番デプロイ

---

## 7. タイムライン見積もり

### 並列開発の場合

- **Phase 0**: 完了済み
- **Phase 1**: 1週間（並列実行）
- **Phase 2**: 2週間（並列実行）
- **Phase 3**: 2週間（並列実行、Phase 2と同時進行可能）
- **Phase 4**: 1週間（並列実行、Phase 1-3と並行可能）
- **Phase 5**: 2週間（順次実行）
- **Phase 6**: 1週間（順次実行）

**合計**: 約6〜7週間（従来の8週間から短縮）

---

## 8. リスク管理

### 高リスク
- **RISK-001**: API統合時の予期しない不具合
  - 対策: Phase 3でモック実装時にAPIスキーマを厳密に定義
  - 対策: Phase 5-Aで段階的に統合テスト実施

- **RISK-002**: 並列開発による認識齟齬
  - 対策: 設計書を常に最新化
  - 対策: 週次同期ミーティング実施

### 中リスク
- **RISK-003**: モック実装と実装の乖離
  - 対策: tRPCスキーマを早期に確定
  - 対策: OpenAPI/Zodスキーマで型定義を共有

---

## 9. 完了の定義（Definition of Done）

各ユーザーストーリーは以下を満たした時に「完了」とみなす：

1. **実装**: コードが実装され、動作する
2. **テスト**: ユニットテストが作成され、パスする
3. **Lint**: Biomeでlintエラーがない
4. **レビュー**: コードレビューが完了している
5. **マージ**: mainブランチにマージされている
6. **ドキュメント**: 必要に応じてドキュメント更新
7. **受け入れ基準**: 全ての受け入れ基準を満たしている

---

## 10. 次のステップ

実装計画フェーズが完了しました。

**実装開始**:
- Phase 1の各タスク（US-004, US-005, US-006, US-007, US-014, US-026, US-030, US-039, US-040, US-041）から開始可能
- 各チームは独立して並列開発を進められます
