/**
 * チーム管理関連のtRPCルーター
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "../../lib/prisma";
import { generateInviteCode } from "../../utils/inviteCode";
import { DEFAULT_CHORES } from "../../constants/defaultChores";

/**
 * チーム管理ルーター
 */
export const teamRouter = router({
	/**
	 * チーム作成
	 * 
	 * 新しいチームを作成し、デフォルト家事10種類を自動で追加します。
	 * 作成したユーザーは自動的にチームに参加します。
	 */
	create: protectedProcedure
		.input(
			z.object({
				name: z
					.string()
					.min(1, "Team name is required")
					.max(50, "Team name must be 50 characters or less"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// ユーザーが既にチームに所属していないかチェック
			const user = await prisma.user.findUnique({
				where: { cognitoSub: ctx.user.sub },
			});

			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found",
				});
			}

			if (user.teamId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User already belongs to a team",
				});
			}

			// 招待コードを生成（ユニークになるまでリトライ）
			let inviteCode: string;
			let isUnique = false;
			let retryCount = 0;
			const maxRetries = 10;

			do {
				inviteCode = generateInviteCode();
				const existingTeam = await prisma.team.findUnique({
					where: { inviteCode },
				});
				isUnique = !existingTeam;
				retryCount++;

				if (retryCount >= maxRetries) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to generate unique invite code",
					});
				}
			} while (!isUnique);

			// トランザクションでチーム作成、家事追加、ユーザー更新を実行
			const team = await prisma.$transaction(async (tx) => {
				// チーム作成
				const newTeam = await tx.team.create({
					data: {
						name: input.name,
						inviteCode,
					},
				});

				// デフォルト家事を追加
				await tx.chore.createMany({
					data: DEFAULT_CHORES.map((choreName) => ({
						name: choreName,
						teamId: newTeam.id,
						isDefault: true,
					})),
				});

				// ユーザーをチームに参加させる
				await tx.user.update({
					where: { id: user.id },
					data: { teamId: newTeam.id },
				});

				return newTeam;
			});

			return {
				id: team.id,
				name: team.name,
				inviteCode: team.inviteCode,
				createdAt: team.createdAt,
			};
		}),

	/**
	 * チーム参加
	 * 
	 * 招待コードを使用してチームに参加します。
	 */
	join: protectedProcedure
		.input(
			z.object({
				inviteCode: z
					.string()
					.length(8, "Invite code must be 8 characters"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// ユーザー情報を取得
			const user = await prisma.user.findUnique({
				where: { cognitoSub: ctx.user.sub },
			});

			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found",
				});
			}

			// 既にチームに所属していないかチェック
			if (user.teamId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User already belongs to a team",
				});
			}

			// 招待コードでチームを検索
			const team = await prisma.team.findUnique({
				where: { inviteCode: input.inviteCode },
			});

			if (!team) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Invalid invite code",
				});
			}

			// ユーザーをチームに参加させる
			await prisma.user.update({
				where: { id: user.id },
				data: { teamId: team.id },
			});

			return {
				id: team.id,
				name: team.name,
				inviteCode: team.inviteCode,
			};
		}),

	/**
	 * チーム情報取得
	 * 
	 * ユーザーが所属するチームの情報を取得します。
	 */
	get: protectedProcedure.query(async ({ ctx }) => {
		// ユーザー情報を取得
		const user = await prisma.user.findUnique({
			where: { cognitoSub: ctx.user.sub },
			include: {
				team: true,
			},
		});

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found",
			});
		}

		if (!user.team) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User does not belong to any team",
			});
		}

		return {
			id: user.team.id,
			name: user.team.name,
			inviteCode: user.team.inviteCode,
			createdAt: user.team.createdAt,
		};
	}),

	/**
	 * チームメンバー一覧取得
	 * 
	 * ユーザーが所属するチームのメンバー一覧を取得します。
	 */
	getMembers: protectedProcedure.query(async ({ ctx }) => {
		// ユーザー情報を取得
		const user = await prisma.user.findUnique({
			where: { cognitoSub: ctx.user.sub },
		});

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found",
			});
		}

		if (!user.teamId) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User does not belong to any team",
			});
		}

		// チームメンバーを取得
		const members = await prisma.user.findMany({
			where: { teamId: user.teamId },
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
			},
			orderBy: { createdAt: "asc" },
		});

		return members;
	}),
});
