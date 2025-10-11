/**
 * AWS Cognito JWT検証ユーティリティ
 * 
 * Cognitoから発行されたJWTを検証し、ユーザー情報を取得します。
 */

import { CognitoJwtVerifier } from "aws-jwt-verify";

/**
 * Cognito User Pool設定
 */
const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

if (!userPoolId || !clientId) {
	throw new Error(
		"COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set in environment variables",
	);
}

/**
 * JWT検証器の作成
 */
const verifier = CognitoJwtVerifier.create({
	userPoolId,
	tokenUse: "id",
	clientId,
});

/**
 * JWT検証の結果
 */
export interface CognitoUser {
	/** CognitoのユーザーID（sub） */
	sub: string;
	/** メールアドレス */
	email: string;
	/** メール検証済みフラグ */
	emailVerified: boolean;
	/** ユーザー名（cognito:username） */
	username: string;
}

/**
 * JWT検証エラー
 */
export class JwtVerificationError extends Error {
	constructor(message: string, public readonly originalError?: unknown) {
		super(message);
		this.name = "JwtVerificationError";
	}
}

/**
 * CognitoのIDトークンを検証します
 * 
 * @param token - CognitoのIDトークン（Bearer トークン）
 * @returns 検証済みのユーザー情報
 * @throws {JwtVerificationError} JWT検証に失敗した場合
 * 
 * @example
 * ```typescript
 * try {
 *   const user = await verifyCognitoToken("eyJraWQ...");
 *   console.log(user.sub, user.email);
 * } catch (error) {
 *   if (error instanceof JwtVerificationError) {
 *     console.error("JWT verification failed:", error.message);
 *   }
 * }
 * ```
 */
export async function verifyCognitoToken(
	token: string,
): Promise<CognitoUser> {
	try {
		// Bearerプレフィックスを削除
		const cleanToken = token.replace(/^Bearer\s+/i, "");

		// JWTを検証
		const payload = await verifier.verify(cleanToken);

		// ユーザー情報を抽出
		return {
			sub: payload.sub,
			email: payload.email as string,
			emailVerified: (payload.email_verified as boolean) ?? false,
			username: (payload["cognito:username"] as string) ?? payload.sub,
		};
	} catch (error) {
		throw new JwtVerificationError(
			"Failed to verify Cognito token",
			error,
		);
	}
}

/**
 * Authorizationヘッダーからトークンを抽出して検証します
 * 
 * @param authorizationHeader - AuthorizationヘッダーまたはBearer トークン
 * @returns 検証済みのユーザー情報
 * @throws {JwtVerificationError} JWT検証に失敗した場合またはヘッダーが無効な場合
 * 
 * @example
 * ```typescript
 * const user = await verifyAuthorizationHeader(req.headers.authorization);
 * ```
 */
export async function verifyAuthorizationHeader(
	authorizationHeader: string | undefined,
): Promise<CognitoUser> {
	if (!authorizationHeader) {
		throw new JwtVerificationError("Authorization header is missing");
	}

	// "Bearer <token>"の形式を確認
	if (!authorizationHeader.startsWith("Bearer ")) {
		throw new JwtVerificationError(
			"Invalid authorization header format. Expected: Bearer <token>",
		);
	}

	const token = authorizationHeader.substring(7); // "Bearer "を削除

	if (!token) {
		throw new JwtVerificationError("Token is empty");
	}

	return verifyCognitoToken(token);
}
