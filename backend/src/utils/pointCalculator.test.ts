import { describe, it, expect } from "vitest";
import {
	calculatePoints,
	PointCalculationError,
	type CalculatePointsInput,
} from "./pointCalculator";

describe("calculatePoints", () => {
	describe("正常系", () => {
		it("正しくポイントを計算する - 基本ケース", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 30,
				stressLevel: 3,
			};
			const result = calculatePoints(input);
			expect(result.points).toBe(90);
		});

		it("正しくポイントを計算する - 最小値", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 1,
				stressLevel: 1,
			};
			const result = calculatePoints(input);
			expect(result.points).toBe(1);
		});

		it("正しくポイントを計算する - 最大値", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 999,
				stressLevel: 5,
			};
			const result = calculatePoints(input);
			expect(result.points).toBe(4995);
		});

		it("正しくポイントを計算する - ストレス度が低い", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 60,
				stressLevel: 1,
			};
			const result = calculatePoints(input);
			expect(result.points).toBe(60);
		});

		it("正しくポイントを計算する - ストレス度が高い", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 60,
				stressLevel: 5,
			};
			const result = calculatePoints(input);
			expect(result.points).toBe(300);
		});

		it("正しくポイントを計算する - 短時間の家事", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 15,
				stressLevel: 2,
			};
			const result = calculatePoints(input);
			expect(result.points).toBe(30);
		});

		it("正しくポイントを計算する - 長時間の家事", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 120,
				stressLevel: 4,
			};
			const result = calculatePoints(input);
			expect(result.points).toBe(480);
		});
	});

	describe("異常系 - durationMinutes", () => {
		it("durationMinutesが0の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 0,
				stressLevel: 3,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"durationMinutes must be between 1 and 999",
			);
		});

		it("durationMinutesが負の値の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: -10,
				stressLevel: 3,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"durationMinutes must be between 1 and 999",
			);
		});

		it("durationMinutesが1000以上の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 1000,
				stressLevel: 3,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"durationMinutes must be between 1 and 999",
			);
		});

		it("durationMinutesが小数の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 30.5,
				stressLevel: 3,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"durationMinutes must be an integer",
			);
		});

		it("durationMinutesがNaNの場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: Number.NaN,
				stressLevel: 3,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
		});
	});

	describe("異常系 - stressLevel", () => {
		it("stressLevelが0の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 30,
				stressLevel: 0,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"stressLevel must be between 1 and 5",
			);
		});

		it("stressLevelが負の値の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 30,
				stressLevel: -1,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"stressLevel must be between 1 and 5",
			);
		});

		it("stressLevelが6以上の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 30,
				stressLevel: 6,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"stressLevel must be between 1 and 5",
			);
		});

		it("stressLevelが小数の場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 30,
				stressLevel: 3.5,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
			expect(() => calculatePoints(input)).toThrow(
				"stressLevel must be an integer",
			);
		});

		it("stressLevelがNaNの場合はエラー", () => {
			const input: CalculatePointsInput = {
				durationMinutes: 30,
				stressLevel: Number.NaN,
			};
			expect(() => calculatePoints(input)).toThrow(PointCalculationError);
		});
	});

	describe("境界値テスト", () => {
		it("durationMinutes = 1, stressLevel = 1", () => {
			const result = calculatePoints({
				durationMinutes: 1,
				stressLevel: 1,
			});
			expect(result.points).toBe(1);
		});

		it("durationMinutes = 1, stressLevel = 5", () => {
			const result = calculatePoints({
				durationMinutes: 1,
				stressLevel: 5,
			});
			expect(result.points).toBe(5);
		});

		it("durationMinutes = 999, stressLevel = 1", () => {
			const result = calculatePoints({
				durationMinutes: 999,
				stressLevel: 1,
			});
			expect(result.points).toBe(999);
		});

		it("durationMinutes = 999, stressLevel = 5", () => {
			const result = calculatePoints({
				durationMinutes: 999,
				stressLevel: 5,
			});
			expect(result.points).toBe(4995);
		});
	});
});

