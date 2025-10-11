import { describe, it, expect } from "vitest";
import { generateInviteCode, isValidInviteCode } from "./inviteCode";

describe("generateInviteCode", () => {
	it("8文字のコードを生成する", () => {
		const code = generateInviteCode();
		expect(code).toHaveLength(8);
	});

	it("有効な文字のみを含む", () => {
		const code = generateInviteCode();
		expect(isValidInviteCode(code)).toBe(true);
	});

	it("紛らわしい文字（0, O, I, l）を含まない", () => {
		const confusingChars = ["0", "O", "I", "l"];
		for (let i = 0; i < 100; i++) {
			const code = generateInviteCode();
			for (const char of confusingChars) {
				expect(code).not.toContain(char);
			}
		}
	});

	it("毎回異なるコードを生成する（高確率）", () => {
		const codes = new Set<string>();
		const iterations = 100;

		for (let i = 0; i < iterations; i++) {
			codes.add(generateInviteCode());
		}

		// すべてのコードがユニークであることを確認
		expect(codes.size).toBe(iterations);
	});

	it("英数字のみを含む", () => {
		const code = generateInviteCode();
		expect(code).toMatch(/^[A-Za-z0-9]+$/);
	});
});

describe("isValidInviteCode", () => {
	describe("正常系", () => {
		it("有効な招待コードの場合trueを返す", () => {
			expect(isValidInviteCode("Yx4n2Kb9")).toBe(true);
			expect(isValidInviteCode("ABC123xy")).toBe(true);
			expect(isValidInviteCode("aaaabbbb")).toBe(true);
			expect(isValidInviteCode("12345678")).toBe(true);
		});

		it("生成されたコードは常に有効", () => {
			for (let i = 0; i < 50; i++) {
				const code = generateInviteCode();
				expect(isValidInviteCode(code)).toBe(true);
			}
		});
	});

	describe("異常系", () => {
		it("長さが8文字でない場合falseを返す", () => {
			expect(isValidInviteCode("short")).toBe(false);
			expect(isValidInviteCode("toolong123")).toBe(false);
			expect(isValidInviteCode("")).toBe(false);
			expect(isValidInviteCode("1234567")).toBe(false); // 7文字
			expect(isValidInviteCode("123456789")).toBe(false); // 9文字
		});

		it("紛らわしい文字（0）を含む場合falseを返す", () => {
			expect(isValidInviteCode("Yx4n0Kb9")).toBe(false);
			expect(isValidInviteCode("00000000")).toBe(false);
		});

		it("紛らわしい文字（O）を含む場合falseを返す", () => {
			expect(isValidInviteCode("Yx4nOKb9")).toBe(false);
			expect(isValidInviteCode("OOOOOOOO")).toBe(false);
		});

		it("紛らわしい文字（I）を含む場合falseを返す", () => {
			expect(isValidInviteCode("Yx4nIKb9")).toBe(false);
			expect(isValidInviteCode("IIIIIIII")).toBe(false);
		});

		it("紛らわしい文字（l）を含む場合falseを返す", () => {
			expect(isValidInviteCode("Yx4nlKb9")).toBe(false);
			expect(isValidInviteCode("llllllll")).toBe(false);
		});

		it("特殊文字を含む場合falseを返す", () => {
			expect(isValidInviteCode("Yx4n-Kb9")).toBe(false);
			expect(isValidInviteCode("Yx4n_Kb9")).toBe(false);
			expect(isValidInviteCode("Yx4n@Kb9")).toBe(false);
			expect(isValidInviteCode("Yx4n!Kb9")).toBe(false);
		});

		it("スペースを含む場合falseを返す", () => {
			expect(isValidInviteCode("Yx4n Kb9")).toBe(false);
			expect(isValidInviteCode(" Yx4nKb9")).toBe(false);
			expect(isValidInviteCode("Yx4nKb9 ")).toBe(false);
		});
	});

	describe("境界値テスト", () => {
		it("すべて大文字の場合", () => {
			expect(isValidInviteCode("ABCDEFGH")).toBe(true);
		});

		it("すべて小文字の場合", () => {
			expect(isValidInviteCode("abcdefgh")).toBe(true);
		});

		it("すべて数字の場合", () => {
			expect(isValidInviteCode("12345678")).toBe(true);
		});

		it("混在の場合", () => {
			expect(isValidInviteCode("aB1cD2eF")).toBe(true);
		});
	});
});

