import cors from "cors";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router";

const app = express();
const port = process.env.PORT || 3000;

/**
 * CORSミドルウェアの設定
 */
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
	}),
);

/**
 * JSONパーサーミドルウェア
 */
app.use(express.json());

/**
 * ヘルスチェックエンドポイント
 */
app.get("/health", (_req, res) => {
	res.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || "development",
	});
});

/**
 * tRPCミドルウェアの設定
 */
app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

/**
 * サーバー起動
 */
app.listen(port, () => {
	console.log(`🚀 Server is running on http://localhost:${port}`);
	console.log(`📊 Health check: http://localhost:${port}/health`);
	console.log(`🔌 tRPC endpoint: http://localhost:${port}/trpc`);
});

