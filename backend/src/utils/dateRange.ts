/**
 * 期間計算ユーティリティ
 * 
 * ダッシュボードでのランキング・貢献度表示用の期間を計算します。
 */

/**
 * 期間のタイプ
 */
export type PeriodType = "week" | "month";

/**
 * 期間の範囲
 */
export interface DateRange {
	/** 期間の開始日時（この日時を含む） */
	startDate: Date;
	/** 期間の終了日時（この日時を含む） */
	endDate: Date;
}

/**
 * 期間計算のオプション
 */
export interface GetDateRangeOptions {
	/** 基準日（デフォルト: 現在日時） */
	referenceDate?: Date;
}

/**
 * 指定された期間タイプに基づいて日付範囲を取得します
 * 
 * @param periodType - 期間のタイプ（"week" または "month"）
 * @param options - オプション（基準日など）
 * @returns 日付範囲
 * 
 * @remarks
 * - "week": 基準日から過去7日間（基準日を含む）
 * - "month": 基準日の月初（1日）から基準日まで（基準日を含む）
 * 
 * @example
 * ```typescript
 * // 今週（過去7日間）の範囲を取得
 * const weekRange = getDateRange("week");
 * 
 * // 今月（月初から今日まで）の範囲を取得
 * const monthRange = getDateRange("month");
 * 
 * // 特定の日付を基準にした範囲を取得
 * const customRange = getDateRange("week", { 
 *   referenceDate: new Date("2025-01-15") 
 * });
 * ```
 */
export function getDateRange(
	periodType: PeriodType,
	options: GetDateRangeOptions = {},
): DateRange {
	// 基準日を取得（デフォルトは現在日時）
	const referenceDate = options.referenceDate ?? new Date();

	// UTC基準で日付を取得
	const refYear = referenceDate.getUTCFullYear();
	const refMonth = referenceDate.getUTCMonth();
	const refDay = referenceDate.getUTCDate();

	let startDate: Date;
	let endDate: Date;

	switch (periodType) {
		case "week": {
			// 過去7日間: 基準日から6日前の00:00:00.000 UTC
			const startDay = refDay - 6;
			startDate = new Date(Date.UTC(refYear, refMonth, startDay, 0, 0, 0, 0));
			
			// 基準日の23:59:59.999 UTC
			endDate = new Date(Date.UTC(refYear, refMonth, refDay, 23, 59, 59, 999));
			break;
		}

		case "month": {
			// 当月1日の00:00:00.000 UTC
			startDate = new Date(Date.UTC(refYear, refMonth, 1, 0, 0, 0, 0));
			
			// 基準日の23:59:59.999 UTC
			endDate = new Date(Date.UTC(refYear, refMonth, refDay, 23, 59, 59, 999));
			break;
		}

		default: {
			// TypeScriptの網羅性チェック
			const _exhaustiveCheck: never = periodType;
			throw new Error(`Unsupported period type: ${_exhaustiveCheck}`);
		}
	}

	return {
		startDate,
		endDate,
	};
}

/**
 * 日付が指定された範囲内にあるかをチェックします
 * 
 * @param date - チェックする日付
 * @param range - 日付範囲
 * @returns 範囲内であればtrue、そうでなければfalse
 * 
 * @example
 * ```typescript
 * const range = getDateRange("week");
 * const isInRange = isDateInRange(new Date(), range); // true
 * ```
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
	return date >= range.startDate && date <= range.endDate;
}

/**
 * 期間の日数を計算します
 * 
 * @param range - 日付範囲
 * @returns 期間の日数
 * 
 * @example
 * ```typescript
 * const weekRange = getDateRange("week");
 * const days = getDayCount(weekRange); // 7
 * 
 * const monthRange = getDateRange("month");
 * const monthDays = getDayCount(monthRange); // 月によって異なる
 * ```
 */
export function getDayCount(range: DateRange): number {
	// UTC基準で日付部分のみを抽出（タイムゾーンの影響を排除）
	const startYear = range.startDate.getUTCFullYear();
	const startMonth = range.startDate.getUTCMonth();
	const startDay = range.startDate.getUTCDate();

	const endYear = range.endDate.getUTCFullYear();
	const endMonth = range.endDate.getUTCMonth();
	const endDay = range.endDate.getUTCDate();

	// UTC日付として再構築
	const startDate = Date.UTC(startYear, startMonth, startDay);
	const endDate = Date.UTC(endYear, endMonth, endDay);

	// ミリ秒の差を計算し、日数に変換
	const diffMs = endDate - startDate;
	const diffDays = diffMs / (1000 * 60 * 60 * 24);

	// 開始日と終了日の両方を含むため+1
	return diffDays + 1;
}
