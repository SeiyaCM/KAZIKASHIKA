# 設計書

前段階の`.cursor_workflow/specs/requirements.md`を読み込みました。

## 1. システムアーキテクチャ

### 1.1 全体構成

本システムは3層アーキテクチャをベースとしたクラウドネイティブなWebアプリケーションとして設計します。

```
┌─────────────────────────────────────────┐
│        Users (PC/スマートフォン)         │
└─────────────────┬───────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────┐
│     CloudFront (CDN + SSL/TLS)          │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐    ┌───────▼────────┐
│  S3 Bucket   │    │  API Gateway   │
│ (Frontend)   │    │   (HTTP API)   │
└──────────────┘    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │   Lambda       │
                    │  (Backend)     │
                    └───────┬────────┘
                            │
                   ┌────────┼────────┐
                   │                 │
            ┌──────▼──────┐  ┌──────▼──────┐
            │     RDS     │  │   Cognito   │
            │(PostgreSQL) │  │ User Pools  │
            └─────────────┘  └─────────────┘
```

### 1.2 技術スタック

#### フロントエンド
- **フレームワーク**: React 18.x (latest)
- **ビルドツール**: Vite 6.x (latest)
- **言語**: TypeScript 5.x (latest)
- **アーキテクチャ**: Bulletproof React パターン
- **認証**: AWS Amplify 6.x (Cognito統合)
- **状態管理**: Zustand (ローカル状態)
- **サーバー状態**: @trpc/react-query + TanStack Query
- **UIライブラリ**: Tailwind CSS + shadcn/ui
- **フォーム管理**: React Hook Form + Zod
- **グラフ描画**: Recharts
- **ルーティング**: React Router 6.x
- **通知**: sonner (トースト通知)

#### バックエンド
- **フレームワーク**: Express 4.x (latest)
- **言語**: TypeScript 5.x (latest)
- **API**: tRPC 10.x (latest)
- **ORM**: Prisma 5.x (latest)
- **認証**: aws-jwt-verify (Cognito JWT検証)
- **バリデーション**: Zod
- **アーキテクチャパターン**: トランザクションスクリプト

#### データベース
- **RDBMS**: PostgreSQL 15.x
- **ホスティング**: Amazon RDS (db.t3.micro - 無料枠対象)

#### 認証・認可
- **サービス**: Amazon Cognito User Pools
- **認証フロー**: ユーザー名パスワード認証 (USER_PASSWORD_AUTH)
- **トークン**: JWT (ID Token, Access Token, Refresh Token)

#### インフラ
- **クラウドプロバイダー**: AWS
- **フロントエンドホスティング**: Amazon S3 + CloudFront
- **バックエンドホスティング**: AWS Lambda + API Gateway
- **IaC**: AWS CDK (TypeScript)

#### 開発ツール
- **パッケージマネージャー**: npm
- **Formatter/Linter**: Biome
- **コーディング規約**: Google TypeScript Style Guide
- **CI/CD**: GitHub Actions
- **テストフレームワーク**: Vitest
- **E2Eテスト**: Playwright (検討)

### 1.3 モノレポ構成

```
KAZIKASHIKA/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Lambda/Expressエントリーポイント
│   │   ├── trpc/
│   │   │   ├── context.ts              # tRPCコンテキスト（認証情報含む）
│   │   │   ├── trpc.ts                 # tRPC初期化
│   │   │   ├── router.ts               # ルートルーター
│   │   │   └── routers/                # 機能別ルーター
│   │   │       ├── auth.ts             # 認証関連
│   │   │       ├── team.ts             # チーム管理
│   │   │       ├── chore.ts            # 家事管理
│   │   │       ├── choreLog.ts         # 家事記録
│   │   │       └── dashboard.ts        # ダッシュボード
│   │   ├── services/                   # ビジネスロジック
│   │   │   ├── teamService.ts
│   │   │   ├── choreService.ts
│   │   │   ├── choreLogService.ts
│   │   │   └── dashboardService.ts
│   │   ├── utils/                      # ユーティリティ
│   │   │   ├── cognito.ts              # Cognito JWT検証
│   │   │   ├── pointCalculator.ts      # ポイント計算
│   │   │   ├── dateRange.ts            # 期間計算
│   │   │   └── inviteCode.ts           # 招待コード生成
│   │   └── middleware/
│   │       └── errorHandler.ts         # エラーハンドリング
│   ├── prisma/
│   │   ├── schema.prisma               # データベーススキーマ
│   │   ├── seed.ts                     # シードデータ
│   │   └── migrations/                 # マイグレーションファイル
│   ├── tests/
│   │   ├── unit/                       # ユニットテスト
│   │   └── integration/                # 統合テスト
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── main.tsx                # エントリーポイント
│   │   │   ├── App.tsx                 # ルートコンポーネント
│   │   │   ├── routes.tsx              # ルーティング設定
│   │   │   └── providers.tsx           # Providerラッパー
│   │   ├── components/
│   │   │   ├── ui/                     # 基本UIコンポーネント (shadcn/ui)
│   │   │   └── layout/                 # レイアウトコンポーネント
│   │   ├── features/                   # 機能別ディレクトリ
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   ├── components/
│   │   │   │   └── hooks/
│   │   │   ├── onboarding/
│   │   │   ├── chores/
│   │   │   ├── logs/
│   │   │   └── dashboard/
│   │   ├── lib/
│   │   │   ├── trpc.ts                 # tRPCクライアント設定
│   │   │   ├── amplify.ts              # Amplify設定
│   │   │   └── utils.ts                # 共通ユーティリティ
│   │   ├── hooks/                      # 共通hooks
│   │   ├── types/                      # 型定義
│   │   └── stores/                     # 状態管理 (Zustand)
│   ├── tests/
│   │   ├── unit/
│   │   └── e2e/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vitest.config.ts
│
├── infra/
│   ├── bin/
│   │   └── app.ts                      # CDKアプリエントリーポイント
│   ├── lib/
│   │   ├── cognito-stack.ts            # Cognito User Pool
│   │   ├── database-stack.ts           # VPC + RDS
│   │   ├── backend-stack.ts            # Lambda + API Gateway
│   │   └── frontend-stack.ts           # S3 + CloudFront
│   ├── package.json
│   ├── cdk.json
│   └── tsconfig.json
│
├── .github/
│   └── workflows/
│       ├── backend-ci.yml              # バックエンドCI/CD
│       ├── frontend-ci.yml             # フロントエンドCI/CD
│       └── infra-ci.yml                # インフラCI/CD
│
├── docs/
│   ├── infrastructure.drawio.svg       # インフラ構成図
│   ├── database-design.md              # DB設計書
│   └── architecture.md                 # システムアーキテクチャ図
│
├── package.json                        # ルートpackage.json (workspaces)
├── biome.json                          # Biome設定
├── .gitignore
└── README.md
```

## 2. データベース設計

### 2.1 ER図

```
┌────────────┐         ┌────────────┐
│   User     │ N     1 │   Team     │
│────────────│─────────│────────────│
│ id (PK)    │         │ id (PK)    │
│ cognitoSub │         │ name       │
│ email      │         │ inviteCode │
│ username   │         │ createdAt  │
│ teamId(FK) │         │ updatedAt  │
│ createdAt  │         └────────────┘
│ updatedAt  │                │
└──────┬─────┘                │ 1
       │                      │
       │ 1                    │
       │                      │ N
       │ N           ┌────────▼─────┐
       │             │    Chore     │
       │             │──────────────│
       │             │ id (PK)      │
       │             │ name         │
       │             │ teamId (FK)  │
       │             │ isDefault    │
       │             │ createdAt    │
       │             │ updatedAt    │
       │             └──────┬───────┘
       │                    │
       │ N                  │ N
       │                    │
┌──────▼─────────────────┐  │
│  UserChoreStress       │◄─┘
│────────────────────────│
│ id (PK)                │
│ userId (FK)            │
│ choreId (FK)           │
│ stressLevel            │
│ createdAt              │
│ updatedAt              │
│ UNIQUE(userId,choreId) │
└────────────────────────┘
       │ 
       │ 1
       │
       │ N
┌──────▼─────────┐
│   ChoreLog     │
│────────────────│
│ id (PK)        │
│ userId (FK)    │
│ choreId (FK)   │
│ durationMinutes│
│ points         │
│ completedAt    │
│ createdAt      │
└────────────────┘
```

### 2.2 Prismaスキーマ

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ユーザー
model User {
  id         String   @id @default(cuid())
  cognitoSub String   @unique // Cognito User Pool Sub
  email      String   @unique
  username   String
  teamId     String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  team          Team?             @relation(fields: [teamId], references: [id], onDelete: SetNull)
  choreStresses UserChoreStress[]
  choreLogs     ChoreLog[]

  @@index([teamId])
  @@index([cognitoSub])
  @@map("users")
}

// チーム
model Team {
  id         String   @id @default(cuid())
  name       String
  inviteCode String   @unique // 8文字のランダム英数字
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  users  User[]
  chores Chore[]

  @@index([inviteCode])
  @@map("teams")
}

// 家事
model Chore {
  id        String   @id @default(cuid())
  name      String
  teamId    String
  isDefault Boolean  @default(false) // デフォルト家事フラグ
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  team          Team              @relation(fields: [teamId], references: [id], onDelete: Cascade)
  choreStresses UserChoreStress[]
  choreLogs     ChoreLog[]

  @@index([teamId])
  @@map("chores")
}

// ユーザー別家事ストレス度
model UserChoreStress {
  id          String   @id @default(cuid())
  userId      String
  choreId     String
  stressLevel Int      // 1〜5
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  chore Chore @relation(fields: [choreId], references: [id], onDelete: Cascade)

  @@unique([userId, choreId])
  @@index([userId])
  @@index([choreId])
  @@map("user_chore_stresses")
}

// 家事実行記録
model ChoreLog {
  id              String   @id @default(cuid())
  userId          String
  choreId         String
  durationMinutes Int      // 実行時間（分）
  points          Int      // 獲得ポイント
  completedAt     DateTime @default(now())
  createdAt       DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  chore Chore @relation(fields: [choreId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([choreId])
  @@index([completedAt])
  @@map("chore_logs")
}
```

### 2.3 インデックス戦略

- **User.cognitoSub**: 認証時の高速検索
- **User.teamId**: チームメンバー一覧取得の高速化
- **Team.inviteCode**: 招待コード検索の高速化
- **Chore.teamId**: チームの家事リスト取得の高速化
- **UserChoreStress (userId, choreId)**: ユニーク制約 + 高速検索
- **ChoreLog.userId, choreId, completedAt**: ランキング集計・期間フィルタリングの高速化

### 2.4 データ制約

- **User.cognitoSub**: ユニーク制約（Cognitoとの整合性）
- **User.email**: ユニーク制約（重複登録防止）
- **Team.inviteCode**: ユニーク制約（招待コードの一意性）
- **UserChoreStress (userId, choreId)**: ユニーク制約（ストレス度の重複登録防止）
- **stressLevel**: 1〜5の範囲（アプリケーションレベルでバリデーション）
- **durationMinutes**: 1〜999の範囲（アプリケーションレベルでバリデーション）

## 3. 認証・認可設計

### 3.1 Amazon Cognito User Pools設定

#### User Pool属性
- **標準属性**:
  - `email` (必須、一意、自動検証)
  - `email_verified`
- **カスタム属性**: なし（ユーザー名はDBで管理）

#### パスワードポリシー
- 最小長: 8文字
- 大文字、小文字、数字を含む（特殊文字は任意）

#### MFA設定
- オプショナル（コスト削減のため初期は無効化）

#### トークン有効期限
- ID Token: 1時間
- Access Token: 1時間
- Refresh Token: 30日

### 3.2 認証フロー

```
┌──────────────┐
│ 1. ユーザー  │
│   登録       │
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ 2. Amplify Auth.signUp()│
└──────┬──────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 3. Cognito: ユーザー作成     │
│    確認コードをメール送信     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 4. 確認コード入力            │
│    Auth.confirmSignUp()      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 5. tRPC auth.createUser      │
│    DBにユーザー情報を保存    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 6. ログイン                  │
│    Auth.signIn()             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 7. ID Token取得              │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 8. tRPC呼び出し              │
│    AuthorizationヘッダーにJWT│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 9. Backend: JWT検証          │
│    Cognito Sub取得           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 10. Userレコード検索         │
│     tRPCコンテキストに格納   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 11. ビジネスロジック実行     │
└──────────────────────────────┘
```

### 3.3 認可ルール

#### チームベースのアクセス制御
- **原則**: ユーザーは自分が所属するチームのデータのみアクセス可能

#### 具体的なアクセス制御
- **家事リスト閲覧**: チームの家事のみ閲覧可能
- **家事の追加・編集**: チームメンバー全員が可能
- **ストレス度の設定**: 各ユーザーは自分のストレス度のみ設定可能
- **家事記録の作成**: 各ユーザーは自分の記録のみ作成可能
- **家事記録の閲覧**: チームメンバー全員の記録を閲覧可能
- **ダッシュボード**: チームメンバー全員のデータを閲覧可能

### 3.4 認証実装詳細

#### フロントエンド: Amplify設定

```typescript
// frontend/src/lib/amplify.ts

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
      },
    },
  },
});
```

#### フロントエンド: tRPCクライアントでのトークン送信

```typescript
// frontend/src/lib/trpc.ts

import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { AppRouter } from '../../../backend/src/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
      async headers() {
        try {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken?.toString();
          return idToken ? { authorization: `Bearer ${idToken}` } : {};
        } catch {
          return {};
        }
      },
    }),
  ],
});
```

#### バックエンド: Cognito JWT検証

```typescript
// backend/src/utils/cognito.ts

import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export const verifyCognitoToken = async (token: string): Promise<string> => {
  try {
    const payload = await verifier.verify(token);
    return payload.sub; // Cognito Sub
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

#### バックエンド: tRPCコンテキスト

```typescript
// backend/src/trpc/context.ts

import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verifyCognitoToken } from '../utils/cognito';
import { prisma } from '../lib/prisma';

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return { user: null, prisma };
  }

  try {
    const cognitoSub = await verifyCognitoToken(token);
    const user = await prisma.user.findUnique({ 
      where: { cognitoSub },
      include: { team: true },
    });
    return { user, prisma };
  } catch {
    return { user: null, prisma };
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;
```

#### バックエンド: protectedProcedure

```typescript
// backend/src/trpc/trpc.ts

import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

## 4. API設計（tRPCルーター）

### 4.1 認証ルーター (auth.ts)

```typescript
// backend/src/trpc/routers/auth.ts

import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  // Cognitoでユーザー登録後、DBにユーザー情報を保存
  createUser: publicProcedure
    .input(
      z.object({
        cognitoSub: z.string(),
        email: z.string().email(),
        username: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { cognitoSub: input.cognitoSub },
      });

      if (existingUser) {
        return { user: existingUser }; // 既存ユーザーを返す
      }

      const user = await ctx.prisma.user.create({
        data: {
          cognitoSub: input.cognitoSub,
          email: input.email,
          username: input.username,
        },
      });

      return { user };
    }),

  // 現在のユーザー情報取得
  me: protectedProcedure.query(async ({ ctx }) => {
    return { user: ctx.user };
  }),

  // ユーザー名更新
  updateUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { username: input.username },
      });
      return { user };
    }),
});
```

### 4.2 チームルーター (team.ts)

```typescript
// backend/src/trpc/routers/team.ts

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { generateInviteCode } from '../utils/inviteCode';

const DEFAULT_CHORES = [
  '料理', '食器洗い', '掃除機がけ', 'お風呂掃除', 'トイレ掃除',
  '洗濯', '洗濯物を干す', '洗濯物を畳む', 'ゴミ出し', '買い物',
];

export const teamRouter = router({
  // チーム作成
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.teamId) {
        throw new TRPCError({ 
          code: 'BAD_REQUEST', 
          message: 'User already belongs to a team' 
        });
      }

      const inviteCode = generateInviteCode();

      const team = await ctx.prisma.team.create({
        data: {
          name: input.name,
          inviteCode,
        },
      });

      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { teamId: team.id },
      });

      // デフォルト家事を追加
      for (const choreName of DEFAULT_CHORES) {
        await ctx.prisma.chore.create({
          data: {
            name: choreName,
            teamId: team.id,
            isDefault: true,
          },
        });
      }

      return { team };
    }),

  // チームに参加
  join: protectedProcedure
    .input(
      z.object({
        inviteCode: z.string().length(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.teamId) {
        throw new TRPCError({ 
          code: 'BAD_REQUEST', 
          message: 'User already belongs to a team' 
        });
      }

      const team = await ctx.prisma.team.findUnique({
        where: { inviteCode: input.inviteCode },
      });

      if (!team) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Team not found' });
      }

      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { teamId: team.id },
      });

      return { team };
    }),

  // チーム情報取得
  get: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.teamId) {
      return { team: null };
    }

    const team = await ctx.prisma.team.findUnique({
      where: { id: ctx.user.teamId },
    });

    return { team };
  }),

  // チームメンバー一覧取得
  getMembers: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.teamId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User is not in a team' });
    }

    const members = await ctx.prisma.user.findMany({
      where: { teamId: ctx.user.teamId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return { members };
  }),
});
```

### 4.3 家事ルーター (chore.ts)

```typescript
// backend/src/trpc/routers/chore.ts

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const choreRouter = router({
  // 家事リスト取得
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.teamId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User is not in a team' });
    }

    const chores = await ctx.prisma.chore.findMany({
      where: { teamId: ctx.user.teamId },
      include: {
        choreStresses: {
          where: { userId: ctx.user.id },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      chores: chores.map((chore) => ({
        id: chore.id,
        name: chore.name,
        isDefault: chore.isDefault,
        userStressLevel: chore.choreStresses[0]?.stressLevel ?? null,
        createdAt: chore.createdAt,
      })),
    };
  }),

  // 家事追加
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        stressLevel: z.number().int().min(1).max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.teamId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User is not in a team' });
      }

      const chore = await ctx.prisma.chore.create({
        data: {
          name: input.name,
          teamId: ctx.user.teamId,
          isDefault: false,
        },
      });

      await ctx.prisma.userChoreStress.create({
        data: {
          userId: ctx.user.id,
          choreId: chore.id,
          stressLevel: input.stressLevel,
        },
      });

      return { chore };
    }),

  // 家事名編集
  updateName: protectedProcedure
    .input(
      z.object({
        choreId: z.string(),
        name: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const chore = await ctx.prisma.chore.findFirst({
        where: {
          id: input.choreId,
          teamId: ctx.user.teamId,
        },
      });

      if (!chore) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Chore not found' });
      }

      const updatedChore = await ctx.prisma.chore.update({
        where: { id: input.choreId },
        data: { name: input.name },
      });

      return { chore: updatedChore };
    }),

  // ストレス度一括設定（オンボーディング用）
  setStressLevels: protectedProcedure
    .input(
      z.object({
        stressLevels: z.array(
          z.object({
            choreId: z.string(),
            stressLevel: z.number().int().min(1).max(5),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      for (const item of input.stressLevels) {
        await ctx.prisma.userChoreStress.upsert({
          where: {
            userId_choreId: {
              userId: ctx.user.id,
              choreId: item.choreId,
            },
          },
          update: {
            stressLevel: item.stressLevel,
          },
          create: {
            userId: ctx.user.id,
            choreId: item.choreId,
            stressLevel: item.stressLevel,
          },
        });
      }

      return { success: true };
    }),

  // ストレス度更新（個別）
  updateStressLevel: protectedProcedure
    .input(
      z.object({
        choreId: z.string(),
        stressLevel: z.number().int().min(1).max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const stress = await ctx.prisma.userChoreStress.upsert({
        where: {
          userId_choreId: {
            userId: ctx.user.id,
            choreId: input.choreId,
          },
        },
        update: {
          stressLevel: input.stressLevel,
        },
        create: {
          userId: ctx.user.id,
          choreId: input.choreId,
          stressLevel: input.stressLevel,
        },
      });

      return { stress };
    }),
});
```

### 4.4 家事記録ルーター (choreLog.ts)

```typescript
// backend/src/trpc/routers/choreLog.ts

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { calculatePoints } from '../utils/pointCalculator';

export const choreLogRouter = router({
  // 家事完了記録
  create: protectedProcedure
    .input(
      z.object({
        choreId: z.string(),
        durationMinutes: z.number().int().min(1).max(999),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const stress = await ctx.prisma.userChoreStress.findUnique({
        where: {
          userId_choreId: {
            userId: ctx.user.id,
            choreId: input.choreId,
          },
        },
      });

      if (!stress) {
        throw new TRPCError({ 
          code: 'NOT_FOUND', 
          message: 'Stress level not set for this chore' 
        });
      }

      const points = calculatePoints(input.durationMinutes, stress.stressLevel);

      const log = await ctx.prisma.choreLog.create({
        data: {
          userId: ctx.user.id,
          choreId: input.choreId,
          durationMinutes: input.durationMinutes,
          points,
          completedAt: new Date(),
        },
        include: {
          chore: true,
        },
      });

      return { log, points };
    }),

  // 家事記録履歴取得
  list: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const targetUserId = input.userId || ctx.user.id;

      // チーム内のユーザーかチェック
      const targetUser = await ctx.prisma.user.findFirst({
        where: {
          id: targetUserId,
          teamId: ctx.user.teamId,
        },
      });

      if (!targetUser) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
      }

      const logs = await ctx.prisma.choreLog.findMany({
        where: {
          userId: targetUserId,
          ...(input.startDate && input.endDate && {
            completedAt: {
              gte: input.startDate,
              lte: input.endDate,
            },
          }),
        },
        include: {
          chore: true,
        },
        orderBy: { completedAt: 'desc' },
      });

      return { logs };
    }),
});
```

### 4.5 ダッシュボードルーター (dashboard.ts)

```typescript
// backend/src/trpc/routers/dashboard.ts

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDateRange } from '../utils/dateRange';

export const dashboardRouter = router({
  // ランキング取得
  getRanking: protectedProcedure
    .input(
      z.object({
        period: z.enum(['week', 'month']),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user.teamId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User is not in a team' });
      }

      const { start, end } = getDateRange(input.period);

      const members = await ctx.prisma.user.findMany({
        where: { teamId: ctx.user.teamId },
        include: {
          choreLogs: {
            where: {
              completedAt: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      });

      const ranking = members
        .map((member) => ({
          user: {
            id: member.id,
            username: member.username,
          },
          totalPoints: member.choreLogs.reduce((sum, log) => sum + log.points, 0),
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }));

      return { ranking };
    }),

  // 貢献度データ取得（円グラフ用）
  getContribution: protectedProcedure
    .input(
      z.object({
        period: z.enum(['week', 'month']),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user.teamId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User is not in a team' });
      }

      const { start, end } = getDateRange(input.period);

      const members = await ctx.prisma.user.findMany({
        where: { teamId: ctx.user.teamId },
        include: {
          choreLogs: {
            where: {
              completedAt: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      });

      const totalPoints = members.reduce(
        (sum, member) => sum + member.choreLogs.reduce((s, log) => s + log.points, 0),
        0
      );

      const contributions = members.map((member) => {
        const points = member.choreLogs.reduce((sum, log) => sum + log.points, 0);
        const percentage = totalPoints > 0 ? (points / totalPoints) * 100 : 0;
        return {
          user: {
            id: member.id,
            username: member.username,
          },
          points,
          percentage: Math.round(percentage * 10) / 10,
        };
      });

      return { contributions, totalPoints };
    }),
});
```

### 4.6 ルーター統合

```typescript
// backend/src/trpc/router.ts

import { router } from './trpc';
import { authRouter } from './routers/auth';
import { teamRouter } from './routers/team';
import { choreRouter } from './routers/chore';
import { choreLogRouter } from './routers/choreLog';
import { dashboardRouter } from './routers/dashboard';

export const appRouter = router({
  auth: authRouter,
  team: teamRouter,
  chore: choreRouter,
  choreLog: choreLogRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
```

## 5. ビジネスロジック

### 5.1 ポイント計算

```typescript
// backend/src/utils/pointCalculator.ts

export const calculatePoints = (
  durationMinutes: number,
  stressLevel: number
): number => {
  if (durationMinutes < 1 || durationMinutes > 999) {
    throw new Error('Invalid duration: must be between 1 and 999');
  }
  if (stressLevel < 1 || stressLevel > 5) {
    throw new Error('Invalid stress level: must be between 1 and 5');
  }
  return durationMinutes * stressLevel;
};
```

### 5.2 期間計算

```typescript
// backend/src/utils/dateRange.ts

export const getDateRange = (
  period: 'week' | 'month'
): { start: Date; end: Date } => {
  const now = new Date();
  const end = now;
  
  if (period === 'week') {
    // 過去7日間
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  } else {
    // 当月1日から本日まで
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
};
```

### 5.3 招待コード生成

```typescript
// backend/src/utils/inviteCode.ts

import { customAlphabet } from 'nanoid';

// 8文字のランダムな英数字（大文字のみ）
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export const generateInviteCode = (): string => {
  return nanoid();
};
```

## 6. フロントエンド設計

### 6.1 ルーティング設計

```typescript
// frontend/src/app/routes.tsx

import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

// Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ConfirmEmailPage } from '@/features/auth/pages/ConfirmEmailPage';
import { TeamSetupPage } from '@/features/auth/pages/TeamSetupPage';
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage';
import { HomePage } from '@/features/chores/pages/HomePage';
import { ChoresManagementPage } from '@/features/chores/pages/ChoresManagementPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'confirm-email', element: <ConfirmEmailPage /> },
      { 
        path: 'app', 
        element: <ProtectedRoute />,
        children: [
          { path: 'team-setup', element: <TeamSetupPage /> },
          { path: 'onboarding', element: <OnboardingPage /> },
          { path: 'home', element: <HomePage /> },
          { path: 'chores', element: <ChoresManagementPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
        ],
      },
    ],
  },
]);
```

### 6.2 画面設計

#### ログイン画面 (`/login`)
- メールアドレスとパスワード入力フォーム
- Amplify `signIn()` 実行
- ログイン成功後、チーム所属状況に応じてリダイレクト
  - チーム未所属: `/app/team-setup`
  - ストレス度未設定: `/app/onboarding`
  - それ以外: `/app/home`

#### 新規登録画面 (`/register`)
- ユーザー名、メールアドレス、パスワード入力フォーム
- Amplify `signUp()` 実行
- 成功後、`/confirm-email` へ遷移

#### メール確認画面 (`/confirm-email`)
- 確認コード入力フォーム
- Amplify `confirmSignUp()` 実行
- 成功後、tRPC `auth.createUser` でDBにユーザー情報保存
- `/app/team-setup` へ遷移

#### チームセットアップ画面 (`/app/team-setup`)
- チーム作成 or チーム参加を選択
- チーム作成: チーム名入力 → tRPC `team.create`
- チーム参加: 招待コード入力 → tRPC `team.join`
- 完了後、`/app/onboarding` へ遷移

#### オンボーディング画面 (`/app/onboarding`)
- tRPC `chore.list` でデフォルト家事取得
- 1つずつ家事を表示し、ストレス度（1〜5）を選択
- プログレスバーで進捗表示
- 全て完了後、tRPC `chore.setStressLevels` で一括保存
- `/app/home` へ遷移

#### ホーム画面 (`/app/home`)
- tRPC `chore.list` で家事リスト表示
- 各家事に「完了」ボタン
- 完了ボタンクリック → 時間入力モーダル表示
  - 選択肢ボタン: 15分、30分、45分、60分
  - 自由入力欄（1〜999分）
- 時間確定 → tRPC `choreLog.create`
- 獲得ポイントをトースト通知表示

#### 家事管理画面 (`/app/chores`)
- tRPC `chore.list` で家事リスト表示
- 各家事のストレス度を表示・編集可能
- 「新しい家事を追加」ボタン → モーダル表示
  - 家事名入力
  - ストレス度選択
  - tRPC `chore.create`
- 家事編集モーダル
  - 家事名編集: tRPC `chore.updateName`
  - ストレス度編集: tRPC `chore.updateStressLevel`

#### ダッシュボード画面 (`/app/dashboard`)
- 期間選択タブ: 今週 / 今月
- 円グラフ表示（Recharts PieChart）
  - tRPC `dashboard.getContribution`
  - 各メンバーの貢献度割合
- ランキングリスト表示
  - tRPC `dashboard.getRanking`
  - 順位、ユーザー名、合計ポイント

### 6.3 状態管理

#### サーバー状態（tRPC + React Query）
- キャッシュ戦略:
  - 家事リスト: `staleTime: 5分`
  - ダッシュボードデータ: `staleTime: 1分`
  - ユーザー情報: `staleTime: 10分`

#### クライアント状態（Zustand）

```typescript
// frontend/src/stores/uiStore.ts

import { create } from 'zustand';

interface UiStore {
  isChoreLogModalOpen: boolean;
  selectedChoreId: string | null;
  openChoreLogModal: (choreId: string) => void;
  closeChoreLogModal: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isChoreLogModalOpen: false,
  selectedChoreId: null,
  openChoreLogModal: (choreId) => 
    set({ isChoreLogModalOpen: true, selectedChoreId: choreId }),
  closeChoreLogModal: () => 
    set({ isChoreLogModalOpen: false, selectedChoreId: null }),
}));
```

## 7. インフラ設計（AWS）

### 7.1 AWS CDK スタック

#### Cognito Stack

```typescript
// infra/lib/cognito-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, 'KazikashikaUserPool', {
      userPoolName: 'kazikashika-user-pool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
```

#### Database Stack

```typescript
// infra/lib/database-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class DatabaseStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly dbInstance: rds.DatabaseInstance;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'KazikashikaVpc', {
      maxAzs: 2,
      natGateways: 1, // コスト削減
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for RDS',
    });

    this.dbInstance = new rds.DatabaseInstance(this, 'KazikashikaDb', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc: this.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [dbSecurityGroup],
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      multiAz: false, // コスト削減
      databaseName: 'kazikashika',
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      backupRetention: cdk.Duration.days(7),
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
    });

    new cdk.CfnOutput(this, 'DbEndpoint', {
      value: this.dbInstance.dbInstanceEndpointAddress,
    });
  }
}
```

#### Backend Stack

```typescript
// infra/lib/backend-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayIntegrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

interface BackendStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  dbInstance: rds.DatabaseInstance;
  cognitoUserPoolId: string;
  cognitoClientId: string;
}

export class BackendStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: cdk.App, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const backendFunction = new lambda.Function(this, 'BackendFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../backend/dist'),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      environment: {
        DATABASE_URL: `postgresql://${props.dbInstance.secret?.secretValueFromJson('username')}:${props.dbInstance.secret?.secretValueFromJson('password')}@${props.dbInstance.dbInstanceEndpointAddress}:5432/kazikashika`,
        COGNITO_USER_POOL_ID: props.cognitoUserPoolId,
        COGNITO_CLIENT_ID: props.cognitoClientId,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });

    props.dbInstance.connections.allowDefaultPortFrom(backendFunction);

    const httpApi = new apigateway.HttpApi(this, 'HttpApi', {
      apiName: 'kazikashika-api',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigateway.CorsHttpMethod.ANY],
        allowHeaders: ['*'],
      },
    });

    const integration = new apigatewayIntegrations.HttpLambdaIntegration(
      'BackendIntegration',
      backendFunction
    );

    httpApi.addRoutes({
      path: '/trpc/{proxy+}',
      methods: [apigateway.HttpMethod.ANY],
      integration,
    });

    this.apiUrl = httpApi.apiEndpoint;

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.apiUrl,
    });
  }
}
```

#### Frontend Stack

```typescript
// infra/lib/frontend-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: { s3BucketSource: bucket },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset('../frontend/dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: distribution.distributionDomainName,
    });
  }
}
```

### 7.2 コスト見積もり（月間）

| サービス | 想定使用量 | 月間コスト |
|---------|----------|----------|
| Cognito | 50 MAU | 無料枠内 |
| S3 | 5GB, 20,000 GET | 無料枠内 |
| CloudFront | 1TB転送 | 無料枠内 |
| Lambda | 50万リクエスト | 無料枠内 |
| API Gateway | 50万リクエスト | 無料枠内 |
| RDS (db.t3.micro) | 750時間 | 無料枠内 |
| データ転送 | 10GB | ~$1 |
| **合計** | | **$1〜$3/月** |

※ 無料枠は12ヶ月間。それ以降は約$20〜$30/月と想定

## 8. CI/CD設計

### 8.1 バックエンドCI/CD

```yaml
# .github/workflows/backend-ci.yml

name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['backend/**']
  pull_request:
    branches: [main, develop]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run linter
        working-directory: ./backend
        run: npm run lint
      
      - name: Run tests
        working-directory: ./backend
        run: npm run test:coverage
      
      - name: Check coverage threshold
        working-directory: ./backend
        run: npm run test:coverage -- --reporter=json --outputFile=coverage.json
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Build
        working-directory: ./backend
        run: npm run build
      
      - name: Deploy to AWS
        working-directory: ./infra
        run: npm run deploy:backend
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 8.2 フロントエンドCI/CD

```yaml
# .github/workflows/frontend-ci.yml

name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['frontend/**']
  pull_request:
    branches: [main, develop]
    paths: ['frontend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run linter
        working-directory: ./frontend
        run: npm run lint
      
      - name: Run tests
        working-directory: ./frontend
        run: npm run test:coverage
      
      - name: Check coverage threshold
        working-directory: ./frontend
        run: npm run test:coverage -- --reporter=json --outputFile=coverage.json
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Build
        working-directory: ./frontend
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_COGNITO_USER_POOL_ID: ${{ secrets.VITE_COGNITO_USER_POOL_ID }}
          VITE_COGNITO_CLIENT_ID: ${{ secrets.VITE_COGNITO_CLIENT_ID }}
      
      - name: Deploy to S3 and CloudFront
        working-directory: ./infra
        run: npm run deploy:frontend
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 9. テスト戦略

### 9.1 バックエンドテスト

#### ユニットテスト（Vitest）

```typescript
// backend/tests/unit/pointCalculator.test.ts

import { describe, it, expect } from 'vitest';
import { calculatePoints } from '../../src/utils/pointCalculator';

describe('calculatePoints', () => {
  it('正しくポイントを計算する', () => {
    expect(calculatePoints(10, 5)).toBe(50);
    expect(calculatePoints(30, 3)).toBe(90);
  });

  it('無効な実行時間でエラーをスローする', () => {
    expect(() => calculatePoints(0, 5)).toThrow('Invalid duration');
    expect(() => calculatePoints(1000, 5)).toThrow('Invalid duration');
  });

  it('無効なストレス度でエラーをスローする', () => {
    expect(() => calculatePoints(10, 0)).toThrow('Invalid stress level');
    expect(() => calculatePoints(10, 6)).toThrow('Invalid stress level');
  });
});
```

#### カバレッジ目標
- 分岐網羅率: 85%以上

### 9.2 フロントエンドテスト

#### ユニットテスト（Vitest + React Testing Library）

```typescript
// frontend/tests/unit/ChoreList.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChoreList } from '../../src/features/chores/components/ChoreList';

vi.mock('@/lib/trpc', () => ({
  trpc: {
    chore: {
      list: {
        useQuery: () => ({
          data: {
            chores: [
              { id: '1', name: '料理', userStressLevel: 3 },
            ],
          },
          isLoading: false,
        }),
      },
    },
  },
}));

describe('ChoreList', () => {
  it('家事リストを表示する', () => {
    render(<ChoreList />);
    expect(screen.getByText('料理')).toBeInTheDocument();
    expect(screen.getByText('ストレス度: 3')).toBeInTheDocument();
  });
});
```

#### カバレッジ目標
- 分岐網羅率: 75%以上

## 10. セキュリティ設計

### 10.1 セキュリティ要件

- [x] パスワード管理（Cognito）
- [x] JWT認証（Cognito ID Token）
- [x] HTTPS通信（CloudFront, API Gateway）
- [x] CORS設定（API Gateway）
- [x] SQLインジェクション対策（Prisma ORM）
- [x] XSS対策（Reactのデフォルト保護）
- [x] 入力バリデーション（Zod）
- [x] 環境変数の管理（AWS Secrets Manager）
- [x] RDSのプライベート配置
- [x] 認可制御（チームベースのアクセス制御）

### 10.2 セキュリティベストプラクティス

- Lambda関数には最小限の権限のみ付与
- RDSはプライベートサブネットに配置
- API Gatewayにレート制限を設定
- CloudWatch Logsで監査ログを記録

## 11. エラーハンドリング

### 11.1 バックエンド

```typescript
// backend/src/middleware/errorHandler.ts

import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';

export const handleTRPCError = (error: unknown): TRPCError => {
  console.error('Error:', error);

  if (error instanceof TRPCError) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return new TRPCError({
        code: 'CONFLICT',
        message: 'A unique constraint would be violated.',
      });
    }
    if (error.code === 'P2025') {
      return new TRPCError({
        code: 'NOT_FOUND',
        message: 'Record not found.',
      });
    }
  }

  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
  });
};
```

### 11.2 フロントエンド

```typescript
// frontend/src/lib/trpc.ts

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        toast.error(error.message || 'データの取得に失敗しました');
      },
    },
    mutations: {
      onError: (error: any) => {
        toast.error(error.message || '操作に失敗しました');
      },
    },
  },
});
```

## 12. パフォーマンス最適化

### 12.1 フロントエンド
- **コード分割**: React.lazy + Suspense で各ページを遅延読み込み
- **バンドルサイズ削減**: Tree shaking、不要なライブラリの削除
- **キャッシュ戦略**: React QueryのstaleTime設定
- **画像最適化**: WebP形式、遅延読み込み

### 12.2 バックエンド
- **データベースクエリ最適化**: 適切なインデックス、N+1問題の回避
- **Lambda Cold Start対策**: 依存関係の最小化

### 12.3 データベース
- **接続プーリング**: Prisma Accelerate または PgBouncer
- **クエリパフォーマンス**: EXPLAIN ANALYZEで定期的に確認

## 13. 開発環境セットアップ

### 13.1 必要なツール
- Node.js 20.x
- npm 10.x
- PostgreSQL 15.x（ローカル開発用）
- AWS CLI（デプロイ用）

### 13.2 環境変数

#### バックエンド（`.env`）
```
DATABASE_URL="postgresql://user:password@localhost:5432/kazikashika"
COGNITO_USER_POOL_ID="ap-northeast-1_xxxxxxxxx"
COGNITO_CLIENT_ID="xxxxxxxxxxxxxxxxxxxxxxxxxx"
PORT=3000
```

#### フロントエンド（`.env`）
```
VITE_API_URL="http://localhost:3000/trpc"
VITE_COGNITO_USER_POOL_ID="ap-northeast-1_xxxxxxxxx"
VITE_COGNITO_CLIENT_ID="xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 13.3 初期セットアップ手順

```bash
# リポジトリクローン
git clone <repository-url>
cd KAZIKASHIKA

# バックエンドセットアップ
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# フロントエンドセットアップ
cd ../frontend
npm install

# インフラセットアップ
cd ../infra
npm install
```

### 13.4 開発サーバー起動

```bash
# ターミナル1: バックエンド
cd backend
npm run dev

# ターミナル2: フロントエンド
cd frontend
npm run dev
```

## 14. 今後の拡張予定（v1.1以降）

### 14.1 追加機能検討
- 「ありがとう」機能（感謝の気持ちをポイントとは別に送り合える）
- 目標設定機能（チームや個人で月間目標ポイントを設定）
- ゲーミフィケーション要素の拡充（称号、バッジシステム）
- レポート機能（月次でのサマリーレポートを自動生成）

### 14.2 スケーラビリティ対策
- データベース: Read Replicaの導入
- Lambda: Provisioned Concurrency
- キャッシュレイヤー: Redis導入