/**
 * ポイント計算ユーティリティ
 * 
 * 家事の所要時間とストレス度からポイントを計算します。
 * ポイント = 時間（分） × ストレス度（1〜5）
 */

/**
 * ポイント計算の入力パラメータ
 */
export interface CalculatePointsInput {
	/** 家事の所要時間（分） */
	durationMinutes: number;
	/** ストレス度（1〜5） */
	stressLevel: number;
}

/**
 * ポイント計算の結果
 */
export interface CalculatePointsResult {
	/** 計算されたポイント */
	points: number;
}

/**
 * バリデーションエラー
 */
export class PointCalculationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PointCalculationError";
	}
}

/**
 * ポイントを計算します
 * 
 * @param input - 計算に必要なパラメータ
 * @returns 計算されたポイント
 * @throws {PointCalculationError} バリデーションエラーが発生した場合
 * 
 * @example
 * ```typescript
 * const result = calculatePoints({ durationMinutes: 30, stressLevel: 3 });
 * console.log(result.points); // 90
 * ```
 */
export function calculatePoints(
	input: CalculatePointsInput,
): CalculatePointsResult {
	const { durationMinutes, stressLevel } = input;

	// 時間のバリデーション（1〜999分）
	if (!Number.isInteger(durationMinutes)) {
		throw new PointCalculationError(
			"durationMinutes must be an integer",
		);
	}
	if (durationMinutes < 1 || durationMinutes > 999) {
		throw new PointCalculationError(
			"durationMinutes must be between 1 and 999",
		);
	}

	// ストレス度のバリデーション（1〜5）
	if (!Number.isInteger(stressLevel)) {
		throw new PointCalculationError(
			"stressLevel must be an integer",
		);
	}
	if (stressLevel < 1 || stressLevel > 5) {
		throw new PointCalculationError(
			"stressLevel must be between 1 and 5",
		);
	}

	// ポイント計算
	const points = durationMinutes * stressLevel;

	return { points };
}
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
