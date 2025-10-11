import { describe, it, expect } from "vitest";
import {
	getDateRange,
	isDateInRange,
	getDayCount,
	type DateRange,
} from "./dateRange";

describe("getDateRange", () => {
	describe("week（過去7日間）", () => {
		it("基準日を含む過去7日間の範囲を返す", () => {
			// 2025-01-15を基準日とする
			const referenceDate = new Date("2025-01-15T12:00:00Z");
			const range = getDateRange("week", { referenceDate });

			// 開始日: 2025-01-09 00:00:00.000 UTC（7日前）
			expect(range.startDate.getUTCFullYear()).toBe(2025);
			expect(range.startDate.getUTCMonth()).toBe(0); // 0 = January
			expect(range.startDate.getUTCDate()).toBe(9);
			expect(range.startDate.getUTCHours()).toBe(0);
			expect(range.startDate.getUTCMinutes()).toBe(0);
			expect(range.startDate.getUTCSeconds()).toBe(0);
			expect(range.startDate.getUTCMilliseconds()).toBe(0);

			// 終了日: 2025-01-15 23:59:59.999 UTC
			expect(range.endDate.getUTCFullYear()).toBe(2025);
			expect(range.endDate.getUTCMonth()).toBe(0);
			expect(range.endDate.getUTCDate()).toBe(15);
			expect(range.endDate.getUTCHours()).toBe(23);
			expect(range.endDate.getUTCMinutes()).toBe(59);
			expect(range.endDate.getUTCSeconds()).toBe(59);
			expect(range.endDate.getUTCMilliseconds()).toBe(999);
		});

		it("月をまたぐ場合も正しく計算する", () => {
			// 2025-02-03を基準日とする（過去7日間は1月28日から）
			const referenceDate = new Date("2025-02-03T12:00:00Z");
			const range = getDateRange("week", { referenceDate });

			// 開始日: 2025-01-28 UTC
			expect(range.startDate.getUTCFullYear()).toBe(2025);
			expect(range.startDate.getUTCMonth()).toBe(0); // January
			expect(range.startDate.getUTCDate()).toBe(28);

			// 終了日: 2025-02-03 UTC
			expect(range.endDate.getUTCFullYear()).toBe(2025);
			expect(range.endDate.getUTCMonth()).toBe(1); // February
			expect(range.endDate.getUTCDate()).toBe(3);
		});

		it("年をまたぐ場合も正しく計算する", () => {
			// 2025-01-03を基準日とする（過去7日間は2024年12月28日から）
			const referenceDate = new Date("2025-01-03T12:00:00Z");
			const range = getDateRange("week", { referenceDate });

			// 開始日: 2024-12-28 UTC
			expect(range.startDate.getUTCFullYear()).toBe(2024);
			expect(range.startDate.getUTCMonth()).toBe(11); // December
			expect(range.startDate.getUTCDate()).toBe(28);

			// 終了日: 2025-01-03 UTC
			expect(range.endDate.getUTCFullYear()).toBe(2025);
			expect(range.endDate.getUTCMonth()).toBe(0); // January
			expect(range.endDate.getUTCDate()).toBe(3);
		});
	});

	describe("month（当月1日から）", () => {
		it("月初から基準日までの範囲を返す", () => {
			// 2025-01-15を基準日とする
			const referenceDate = new Date("2025-01-15T12:00:00Z");
			const range = getDateRange("month", { referenceDate });

			// 開始日: 2025-01-01 00:00:00.000 UTC
			expect(range.startDate.getUTCFullYear()).toBe(2025);
			expect(range.startDate.getUTCMonth()).toBe(0);
			expect(range.startDate.getUTCDate()).toBe(1);
			expect(range.startDate.getUTCHours()).toBe(0);
			expect(range.startDate.getUTCMinutes()).toBe(0);
			expect(range.startDate.getUTCSeconds()).toBe(0);
			expect(range.startDate.getUTCMilliseconds()).toBe(0);

			// 終了日: 2025-01-15 23:59:59.999 UTC
			expect(range.endDate.getUTCFullYear()).toBe(2025);
			expect(range.endDate.getUTCMonth()).toBe(0);
			expect(range.endDate.getUTCDate()).toBe(15);
			expect(range.endDate.getUTCHours()).toBe(23);
			expect(range.endDate.getUTCMinutes()).toBe(59);
			expect(range.endDate.getUTCSeconds()).toBe(59);
			expect(range.endDate.getUTCMilliseconds()).toBe(999);
		});

		it("月初日の場合、その日だけが範囲となる", () => {
			const referenceDate = new Date("2025-01-01T12:00:00Z");
			const range = getDateRange("month", { referenceDate });

			expect(range.startDate.getUTCDate()).toBe(1);
			expect(range.endDate.getUTCDate()).toBe(1);
			expect(range.startDate.getUTCMonth()).toBe(range.endDate.getUTCMonth());
		});

		it("月末日の場合、月全体が範囲となる", () => {
			// 2025-01-31（1月末日）
			const referenceDate = new Date("2025-01-31T12:00:00Z");
			const range = getDateRange("month", { referenceDate });

			expect(range.startDate.getUTCDate()).toBe(1);
			expect(range.endDate.getUTCDate()).toBe(31);
			expect(range.startDate.getUTCMonth()).toBe(0);
			expect(range.endDate.getUTCMonth()).toBe(0);
		});

		it("うるう年の2月も正しく計算する", () => {
			// 2024年はうるう年（2月29日まで）
			const referenceDate = new Date("2024-02-29T12:00:00Z");
			const range = getDateRange("month", { referenceDate });

			expect(range.startDate.getUTCDate()).toBe(1);
			expect(range.endDate.getUTCDate()).toBe(29);
			expect(range.startDate.getUTCMonth()).toBe(1); // February
			expect(range.endDate.getUTCMonth()).toBe(1);
		});
	});

	describe("基準日が指定されない場合", () => {
		it("現在日時を基準とする", () => {
			const now = new Date();
			const range = getDateRange("week");

			// 終了日は今日の23:59:59.999 UTC
			expect(range.endDate.getUTCFullYear()).toBe(now.getUTCFullYear());
			expect(range.endDate.getUTCMonth()).toBe(now.getUTCMonth());
			expect(range.endDate.getUTCDate()).toBe(now.getUTCDate());
			expect(range.endDate.getUTCHours()).toBe(23);
			expect(range.endDate.getUTCMinutes()).toBe(59);
		});
	});
});

describe("isDateInRange", () => {
	it("範囲内の日付の場合trueを返す", () => {
		const range: DateRange = {
			startDate: new Date("2025-01-10T00:00:00Z"),
			endDate: new Date("2025-01-15T23:59:59.999Z"),
		};

		const dateInRange = new Date("2025-01-12T12:00:00Z");
		expect(isDateInRange(dateInRange, range)).toBe(true);
	});

	it("範囲の開始日の場合trueを返す", () => {
		const range: DateRange = {
			startDate: new Date("2025-01-10T00:00:00Z"),
			endDate: new Date("2025-01-15T23:59:59.999Z"),
		};

		const dateOnStart = new Date("2025-01-10T00:00:00Z");
		expect(isDateInRange(dateOnStart, range)).toBe(true);
	});

	it("範囲の終了日の場合trueを返す", () => {
		const range: DateRange = {
			startDate: new Date("2025-01-10T00:00:00Z"),
			endDate: new Date("2025-01-15T23:59:59.999Z"),
		};

		const dateOnEnd = new Date("2025-01-15T23:59:59.999Z");
		expect(isDateInRange(dateOnEnd, range)).toBe(true);
	});

	it("範囲より前の日付の場合falseを返す", () => {
		const range: DateRange = {
			startDate: new Date("2025-01-10T00:00:00Z"),
			endDate: new Date("2025-01-15T23:59:59.999Z"),
		};

		const dateBeforeRange = new Date("2025-01-09T23:59:59.999Z");
		expect(isDateInRange(dateBeforeRange, range)).toBe(false);
	});

	it("範囲より後の日付の場合falseを返す", () => {
		const range: DateRange = {
			startDate: new Date("2025-01-10T00:00:00Z"),
			endDate: new Date("2025-01-15T23:59:59.999Z"),
		};

		const dateAfterRange = new Date("2025-01-16T00:00:00Z");
		expect(isDateInRange(dateAfterRange, range)).toBe(false);
	});
});

describe("getDayCount", () => {
	it("weekの範囲の日数は7日", () => {
		const referenceDate = new Date("2025-01-15T12:00:00Z");
		const range = getDateRange("week", { referenceDate });
		const dayCount = getDayCount(range);

		expect(dayCount).toBe(7);
	});

	it("monthの範囲の日数は月によって異なる", () => {
		// 1月（31日）
		const jan = getDateRange("month", {
			referenceDate: new Date("2025-01-31T12:00:00Z"),
		});
		expect(getDayCount(jan)).toBe(31);

		// 2月（28日、2025年は平年）
		const feb = getDateRange("month", {
			referenceDate: new Date("2025-02-28T12:00:00Z"),
		});
		expect(getDayCount(feb)).toBe(28);

		// 4月（30日）
		const apr = getDateRange("month", {
			referenceDate: new Date("2025-04-30T12:00:00Z"),
		});
		expect(getDayCount(apr)).toBe(30);
	});

	it("月の途中の場合、1日からその日までの日数", () => {
		// 1月15日の場合、15日間
		const range = getDateRange("month", {
			referenceDate: new Date("2025-01-15T12:00:00Z"),
		});
		expect(getDayCount(range)).toBe(15);
	});

	it("月初日の場合は1日", () => {
		const range = getDateRange("month", {
			referenceDate: new Date("2025-01-01T12:00:00Z"),
		});
		expect(getDayCount(range)).toBe(1);
	});

	it("カスタム範囲の日数も正しく計算する", () => {
		const range: DateRange = {
			startDate: new Date("2025-01-01T00:00:00Z"),
			endDate: new Date("2025-01-10T23:59:59.999Z"),
		};
		expect(getDayCount(range)).toBe(10);
	});
});

describe("統合テスト", () => {
	it("週範囲の全日付がisDateInRangeでtrueを返す", () => {
		const referenceDate = new Date("2025-01-15T12:00:00Z");
		const range = getDateRange("week", { referenceDate });

		// 7日間すべてチェック
		for (let i = 0; i < 7; i++) {
			const date = new Date("2025-01-09T12:00:00Z");
			date.setDate(date.getDate() + i);
			expect(isDateInRange(date, range)).toBe(true);
		}
	});

	it("月範囲の全日付がisDateInRangeでtrueを返す", () => {
		const referenceDate = new Date("2025-01-15T12:00:00Z");
		const range = getDateRange("month", { referenceDate });

		// 1月1日から15日までチェック
		for (let i = 1; i <= 15; i++) {
			const date = new Date(`2025-01-${String(i).padStart(2, "0")}T12:00:00Z`);
			expect(isDateInRange(date, range)).toBe(true);
		}
	});
});

