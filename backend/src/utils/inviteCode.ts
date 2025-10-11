/**
 * 招待コード生成ユーティリティ
 * 
 * チーム招待用のユニークなコードを生成します。
 */

import { customAlphabet } from "nanoid";

/**
 * 招待コード生成に使用する文字セット
 * 紛らわしい文字（0, O, I, l など）を除外
 */
const INVITE_CODE_ALPHABET =
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * 招待コードの長さ
 */
const INVITE_CODE_LENGTH = 8;

/**
 * カスタムアルファベットでnanoidを初期化
 */
const generateId = customAlphabet(INVITE_CODE_ALPHABET, INVITE_CODE_LENGTH);

/**
 * チーム招待用のユニークなコードを生成します
 * 
 * @returns 8文字の招待コード（例: "Yx4n2Kb9"）
 * 
 * @example
 * ```typescript
 * const inviteCode = generateInviteCode();
 * console.log(inviteCode); // "Yx4n2Kb9"
 * ```
 * 
 * @remarks
 * - 紛らわしい文字（0, O, I, l など）は除外されています
 * - 衝突確率は極めて低いですが、DB制約でユニーク性を保証します
 */
export function generateInviteCode(): string {
	return generateId();
}

/**
 * 招待コードのバリデーション
 * 
 * @param code - 検証する招待コード
 * @returns 有効な場合はtrue、無効な場合はfalse
 * 
 * @example
 * ```typescript
 * isValidInviteCode("Yx4n2Kb9"); // true
 * isValidInviteCode("invalid"); // false (長さが不正)
 * isValidInviteCode("Yx4n0Kb9"); // false (0が含まれている)
 * ```
 */
export function isValidInviteCode(code: string): boolean {
	// 長さチェック
	if (code.length !== INVITE_CODE_LENGTH) {
		return false;
	}

	// 文字セットチェック
	const validChars = new Set(INVITE_CODE_ALPHABET);
	for (const char of code) {
		if (!validChars.has(char)) {
			return false;
		}
	}

	return true;
}
