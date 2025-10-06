import { initTRPC } from "@trpc/server";
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

