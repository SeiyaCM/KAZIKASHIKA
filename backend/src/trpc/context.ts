import type { Request, Response } from "express";

/**
 * tRPCコンテキストの型定義
 */
export interface Context {
	req: Request;
	res: Response;
}

/**
 * tRPCコンテキストの作成関数
 */
export const createContext = ({
	req,
	res,
}: {
	req: Request;
	res: Response;
}): Context => {
	return {
		req,
		res,
	};
};

