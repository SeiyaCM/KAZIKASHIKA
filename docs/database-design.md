# データベース設計書

## 1. 概要

本ドキュメントはKAZIKASHIKAアプリケーションのデータベース設計を詳細に記述します。

### 1.1 データベース仕様
- **RDBMS**: PostgreSQL 15.x
- **ホスティング**: Amazon RDS (db.t3.micro)
- **ORM**: Prisma 5.x
- **文字コード**: UTF-8

## 2. ER図

```
┌────────────────────┐         ┌────────────────────┐
│       User         │ N     1 │       Team         │
│────────────────────│─────────│────────────────────│
│ id (PK)            │         │ id (PK)            │
│ cognitoSub (UQ)    │         │ name               │
│ email (UQ)         │         │ inviteCode (UQ)    │
│ username           │         │ createdAt          │
│ teamId (FK)        │         │ updatedAt          │
│ createdAt          │         └────────────────────┘
│ updatedAt          │                │
└──────┬─────────────┘                │
       │                              │ 1
       │ 1                            │
       │                              │
       │ N                            │ N
       │                    ┌─────────▼──────────┐
       │                    │       Chore        │
       │                    │────────────────────│
       │                    │ id (PK)            │
       │                    │ name               │
       │                    │ teamId (FK)        │
       │                    │ isDefault          │
       │                    │ createdAt          │
       │                    │ updatedAt          │
       │                    └─────────┬──────────┘
       │                              │
       │ N                            │ N
       │                              │
┌──────▼──────────────────────────┐  │
│    UserChoreStress              │◄─┘
│─────────────────────────────────│
│ id (PK)                         │
│ userId (FK)                     │
│ choreId (FK)                    │
│ stressLevel (1-5)               │
│ createdAt                       │
│ updatedAt                       │
│ UNIQUE(userId, choreId)         │
└──────┬──────────────────────────┘
       │ 
       │ 1
       │
       │ N
┌──────▼──────────────┐
│     ChoreLog        │
│─────────────────────│
│ id (PK)             │
│ userId (FK)         │
│ choreId (FK)        │
│ durationMinutes     │
│ points              │
│ completedAt         │
│ createdAt           │
└─────────────────────┘
```

## 3. テーブル定義

### 3.1 User（ユーザー）

家事アプリを利用するユーザー情報を管理します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|-----------|------|
| id | String (cuid) | NO | auto | プライマリキー |
| cognitoSub | String | NO | - | Cognito User Pool Sub（一意） |
| email | String | NO | - | メールアドレス（一意） |
| username | String | NO | - | ユーザー表示名 |
| teamId | String | YES | NULL | 所属チームID（外部キー） |
| createdAt | DateTime | NO | now() | レコード作成日時 |
| updatedAt | DateTime | NO | auto | レコード更新日時 |

#### インデックス
- `cognitoSub` (UNIQUE): 認証時の高速検索
- `email` (UNIQUE): 重複登録防止
- `teamId`: チームメンバー一覧取得の高速化

#### 外部キー制約
- `teamId` → `Team(id)` ON DELETE SET NULL

#### ビジネスルール
- ユーザーは最大1つのチームにのみ所属可能
- Cognitoでの認証成功後にDBレコードが作成される
- チーム削除時はteamIdがNULLに設定される

---

### 3.2 Team（チーム）

ユーザーが所属するチーム情報を管理します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|-----------|------|
| id | String (cuid) | NO | auto | プライマリキー |
| name | String | NO | - | チーム名 |
| inviteCode | String | NO | auto | 招待コード（8文字の英数字、一意） |
| createdAt | DateTime | NO | now() | レコード作成日時 |
| updatedAt | DateTime | NO | auto | レコード更新日時 |

#### インデックス
- `inviteCode` (UNIQUE): 招待コード検索の高速化

#### ビジネスルール
- 招待コードは8文字のランダムな英数字（大文字のみ）
- チーム作成時にデフォルト家事（10種類）が自動作成される
- チームは複数のユーザーを持つことができる

---

### 3.3 Chore（家事）

チームで管理する家事の種類を定義します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|-----------|------|
| id | String (cuid) | NO | auto | プライマリキー |
| name | String | NO | - | 家事名 |
| teamId | String | NO | - | 所属チームID（外部キー） |
| isDefault | Boolean | NO | false | デフォルト家事フラグ |
| createdAt | DateTime | NO | now() | レコード作成日時 |
| updatedAt | DateTime | NO | auto | レコード更新日時 |

#### インデックス
- `teamId`: チームの家事リスト取得の高速化

#### 外部キー制約
- `teamId` → `Team(id)` ON DELETE CASCADE

#### ビジネスルール
- 家事は特定のチームに所属する
- チーム作成時に以下のデフォルト家事が自動作成される：
  1. 料理
  2. 食器洗い
  3. 掃除機がけ
  4. お風呂掃除
  5. トイレ掃除
  6. 洗濯
  7. 洗濯物を干す
  8. 洗濯物を畳む
  9. ゴミ出し
  10. 買い物
- ユーザーは追加の家事を自由に作成可能
- チーム削除時に関連する家事も削除される（CASCADE）

---

### 3.4 UserChoreStress（ユーザー別家事ストレス度）

各ユーザーが各家事に対して感じるストレス度を管理します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|-----------|------|
| id | String (cuid) | NO | auto | プライマリキー |
| userId | String | NO | - | ユーザーID（外部キー） |
| choreId | String | NO | - | 家事ID（外部キー） |
| stressLevel | Integer | NO | - | ストレス度（1〜5） |
| createdAt | DateTime | NO | now() | レコード作成日時 |
| updatedAt | DateTime | NO | auto | レコード更新日時 |

#### インデックス
- `(userId, choreId)` (UNIQUE): 重複登録防止
- `userId`: ユーザーのストレス度一覧取得の高速化
- `choreId`: 家事のストレス度一覧取得の高速化

#### 外部キー制約
- `userId` → `User(id)` ON DELETE CASCADE
- `choreId` → `Chore(id)` ON DELETE CASCADE

#### ビジネスルール
- ストレス度は1（楽）〜5（大変）の整数値
- 1ユーザー×1家事の組み合わせは一意（UNIQUE制約）
- オンボーディング時に全デフォルト家事のストレス度を設定
- ユーザーまたは家事が削除されると関連レコードも削除される（CASCADE）
- ストレス度が未設定の家事は記録できない

---

### 3.5 ChoreLog（家事実行記録）

ユーザーが家事を実行した記録を保存します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|-----------|------|
| id | String (cuid) | NO | auto | プライマリキー |
| userId | String | NO | - | 実行したユーザーID（外部キー） |
| choreId | String | NO | - | 実行した家事ID（外部キー） |
| durationMinutes | Integer | NO | - | 実行時間（分）：1〜999 |
| points | Integer | NO | - | 獲得ポイント |
| completedAt | DateTime | NO | now() | 家事完了日時 |
| createdAt | DateTime | NO | now() | レコード作成日時 |

#### インデックス
- `userId`: ユーザーの記録履歴取得の高速化
- `choreId`: 家事の実行履歴取得の高速化
- `completedAt`: 期間フィルタリング・ランキング集計の高速化

#### 外部キー制約
- `userId` → `User(id)` ON DELETE CASCADE
- `choreId` → `Chore(id)` ON DELETE CASCADE

#### ビジネスルール
- ポイント計算式: `points = durationMinutes × stressLevel`
- durationMinutesは1〜999の範囲（アプリケーションレベルでバリデーション）
- 記録は削除不可（データの整合性保持）
- ユーザーまたは家事が削除されると関連レコードも削除される（CASCADE）
- ランキング集計時は `completedAt` でフィルタリングされる

---

## 4. インデックス戦略

### 4.1 プライマリインデックス
全テーブルで `id (cuid)` をプライマリキーとして使用します。

### 4.2 セカンダリインデックス

| テーブル | カラム | 種類 | 目的 |
|---------|-------|------|------|
| User | cognitoSub | UNIQUE | 認証時の高速検索 |
| User | email | UNIQUE | 重複登録防止 |
| User | teamId | INDEX | チームメンバー一覧取得 |
| Team | inviteCode | UNIQUE | 招待コード検索 |
| Chore | teamId | INDEX | チームの家事リスト取得 |
| UserChoreStress | (userId, choreId) | UNIQUE | 重複登録防止 |
| UserChoreStress | userId | INDEX | ユーザーのストレス度取得 |
| UserChoreStress | choreId | INDEX | 家事のストレス度取得 |
| ChoreLog | userId | INDEX | ユーザーの記録履歴取得 |
| ChoreLog | choreId | INDEX | 家事の実行履歴取得 |
| ChoreLog | completedAt | INDEX | 期間フィルタリング・集計 |

### 4.3 複合インデックス
`UserChoreStress` テーブルの `(userId, choreId)` は、UNIQUE制約と同時にクエリの高速化にも使用されます。

---

## 5. データ制約

### 5.1 一意性制約（UNIQUE）
- `User.cognitoSub`: Cognitoとの整合性
- `User.email`: 重複登録防止
- `Team.inviteCode`: 招待コードの一意性
- `UserChoreStress (userId, choreId)`: ストレス度の重複登録防止

### 5.2 アプリケーションレベルの制約
以下の制約はPrismaとZodを使用してアプリケーションレベルで実装します。

- `UserChoreStress.stressLevel`: 1〜5の範囲
- `ChoreLog.durationMinutes`: 1〜999の範囲
- `Chore.name`: 1〜100文字
- `Team.name`: 1〜50文字
- `User.username`: 1〜50文字

---

## 6. カスケード削除ルール

### 6.1 CASCADE
以下の外部キー制約は `ON DELETE CASCADE` を設定します。

- `Chore.teamId` → `Team.id`
  - チーム削除時に関連する家事も削除
- `UserChoreStress.userId` → `User.id`
  - ユーザー削除時に関連するストレス度設定も削除
- `UserChoreStress.choreId` → `Chore.id`
  - 家事削除時に関連するストレス度設定も削除
- `ChoreLog.userId` → `User.id`
  - ユーザー削除時に関連する記録も削除
- `ChoreLog.choreId` → `Chore.id`
  - 家事削除時に関連する記録も削除

### 6.2 SET NULL
- `User.teamId` → `Team.id`
  - チーム削除時にユーザーのteamIdをNULLに設定

---

## 7. データマイグレーション戦略

### 7.1 開発環境
```bash
# マイグレーション作成と適用
npx prisma migrate dev --name <migration_name>

# Prismaクライアント再生成
npx prisma generate
```

### 7.2 本番環境
```bash
# マイグレーション適用（新規作成はしない）
npx prisma migrate deploy
```

### 7.3 シードデータ
```bash
# シードデータ投入
npx prisma db seed
```

**注意**: デフォルト家事はチーム作成時に動的に生成されるため、シードスクリプトでは実行しません。

---

## 8. パフォーマンス最適化

### 8.1 N+1問題対策
Prismaの `include` や `select` を活用してN+1問題を回避します。

```typescript
// 良い例：includeでリレーションを事前取得
const chores = await prisma.chore.findMany({
  where: { teamId: ctx.user.teamId },
  include: {
    choreStresses: {
      where: { userId: ctx.user.id },
    },
  },
});
```

### 8.2 クエリ最適化
- 必要なフィールドのみ取得（`select` の活用）
- 適切な `where` 条件でデータを絞り込み
- `orderBy` の使用時はインデックスを活用

### 8.3 接続プーリング
- 開発環境: Prismaのデフォルト接続プーリング
- 本番環境: Prisma Accelerate または PgBouncerの導入検討

---

## 9. バックアップ戦略

### 9.1 自動バックアップ
- RDSの自動バックアップ機能を有効化
- 保持期間: 7日間

### 9.2 手動バックアップ
- 重要な変更前に手動スナップショット作成
- スナップショットは無期限保持

### 9.3 リストア手順
```bash
# AWS CLIでスナップショットからリストア
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier kazikashika-restored \
  --db-snapshot-identifier <snapshot-id>
```

---

## 10. セキュリティ

### 10.1 アクセス制御
- RDSはプライベートサブネットに配置
- Lambda関数からのみアクセス可能
- セキュリティグループで厳密に制御

### 10.2 認証情報管理
- データベース認証情報はAWS Secrets Managerで管理
- 環境変数を通じてアプリケーションに注入

### 10.3 SQLインジェクション対策
- Prisma ORMを使用することで自動的に対策
- 生SQLの使用は原則禁止

---

## 11. 監視とメンテナンス

### 11.1 監視項目
- CPU使用率
- メモリ使用率
- ストレージ使用量
- 接続数
- スロークエリ

### 11.2 定期メンテナンス
- 月次でスロークエリログを確認
- 必要に応じてインデックスを追加・最適化
- データ増加に応じてストレージ容量を監視

---

## 12. スケーラビリティ

### 12.1 垂直スケーリング
- ユーザー数増加に応じてRDSインスタンスタイプを変更
- db.t3.micro → db.t3.small → db.t3.medium

### 12.2 水平スケーリング（将来検討）
- Read Replicaの導入
- 読み取り負荷の分散

### 12.3 データアーカイブ（将来検討）
- 古い `ChoreLog` データのアーカイブ
- 1年以上前のデータをS3に移行

---

## 13. データ整合性

### 13.1 トランザクション管理
Prismaのトランザクション機能を活用します。

```typescript
await prisma.$transaction([
  prisma.team.create({ data: teamData }),
  prisma.chore.createMany({ data: choreData }),
]);
```

### 13.2 データ整合性チェック
- 外部キー制約で関係の整合性を保証
- アプリケーションレベルでの二重チェック

---

## 14. テストデータ

### 14.1 開発環境用テストデータ
```bash
# テストデータ投入スクリプト
npm run seed:test
```

### 14.2 テストデータ構成
- テストユーザー: 3名
- テストチーム: 1つ
- デフォルト家事: 10種類
- 家事記録: 過去1ヶ月分（ダミーデータ）

---

## 15. 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|-----|----------|---------|-------|
| 2025-10-05 | 1.0 | 初版作成 | - |

