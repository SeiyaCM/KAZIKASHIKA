import type { Request, Response } from "express";
import {
	verifyAuthorizationHeader,
	type CognitoUser,
} from "../utils/cognito";

/**
 * tRPCコンテキストの型定義
 */
export interface Context {
	/** Expressリクエストオブジェクト */
	req: Request;
	/** Expressレスポンスオブジェクト */
	res: Response;
	/** 認証済みユーザー情報（認証されている場合のみ） */
	user?: CognitoUser;
}

/**
 * tRPCコンテキストの作成関数
 * 
 * リクエストのAuthorizationヘッダーからJWTを抽出・検証し、
 * ユーザー情報をコンテキストに含めます。
 */
export const createContext = async ({
	req,
	res,
}: {
	req: Request;
	res: Response;
}): Promise<Context> => {
	// Authorizationヘッダーがある場合はJWT検証を試みる
	const authHeader = req.headers.authorization;
	let user: CognitoUser | undefined;

	if (authHeader) {
		try {
			user = await verifyAuthorizationHeader(authHeader);
		} catch (error) {
			// JWT検証失敗は無視（publicProcedureでも使えるように）
			// protectedProcedureで認証チェックを行う
			console.warn("JWT verification failed:", error);
		}
	}

	return {
		req,
		res,
		user,
	};
};

