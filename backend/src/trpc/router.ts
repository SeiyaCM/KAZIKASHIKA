import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { authRouter } from "./routers/auth";
import { teamRouter } from "./routers/team";

/**
 * ルートルーター
 */
export const appRouter = router({
	/**
	 * ヘルスチェック用のクエリ
	 */
	hello: publicProcedure
		.input(
			z
				.object({
					name: z.string().optional(),
				})
				.optional(),
		)
		.query(({ input }) => {
			return {
				greeting: `Hello ${input?.name ?? "World"}!`,
				timestamp: new Date().toISOString(),
			};
		}),

	/**
	 * 認証関連のAPI
	 */
	auth: authRouter,

	/**
	 * チーム管理関連のAPI
	 */
	team: teamRouter,
});

/**
 * アプリケーションのルーター型をエクスポート
 * フロントエンドで型安全なクライアントを作成するために使用
 */
export type AppRouter = typeof appRouter;

