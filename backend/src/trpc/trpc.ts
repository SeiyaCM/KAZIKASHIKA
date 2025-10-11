import { TRPCError, initTRPC } from "@trpc/server";
import type { Context } from "./context";

/**
 * tRPCインスタンスの初期化
 */
const t = initTRPC.context<Context>().create();

/**
 * 公開用のルーター（認証不要）
 */
export const router = t.router;

/**
 * 公開用のプロシージャ（認証不要）
 */
export const publicProcedure = t.procedure;

/**
 * 認証済みユーザーのみアクセス可能なプロシージャ
 * 
 * コンテキストにユーザー情報が含まれていない場合はUNAUTHORIZEDエラーを返します。
 * 
 * @example
 * ```typescript
 * protectedProcedure
 *   .query(({ ctx }) => {
 *     // ctx.userは必ず存在する
 *     return { userId: ctx.user.sub };
 *   });
 * ```
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		});
	}

	return next({
		ctx: {
			...ctx,
			// ctx.userは必ず存在することを型で保証
			user: ctx.user,
		},
	});
});

