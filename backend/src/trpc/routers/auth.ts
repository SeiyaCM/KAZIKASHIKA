/**
 * 認証関連のtRPCルーター
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { prisma } from "../../lib/prisma";

/**
 * 認証ルーター
 */
export const authRouter = router({
	/**
	 * ユーザー作成
	 * 
	 * Cognito登録後に呼び出して、DBにユーザー情報を登録します。
	 */
	createUser: publicProcedure
		.input(
			z.object({
				cognitoSub: z.string().min(1, "Cognito Sub is required"),
				email: z.string().email("Invalid email format"),
				username: z.string().min(1, "Username is required"),
			}),
		)
		.mutation(async ({ input }) => {
			// 既存ユーザーチェック
			const existingUser = await prisma.user.findUnique({
				where: { cognitoSub: input.cognitoSub },
			});

			if (existingUser) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "User already exists",
				});
			}

			// ユーザー作成
			const user = await prisma.user.create({
				data: {
					cognitoSub: input.cognitoSub,
					email: input.email,
					username: input.username,
				},
			});

			return {
				id: user.id,
				email: user.email,
				username: user.username,
				teamId: user.teamId,
				createdAt: user.createdAt,
			};
		}),

	/**
	 * 現在のユーザー情報取得
	 * 
	 * 認証済みユーザーの情報をDBから取得します。
	 */
	me: protectedProcedure.query(async ({ ctx }) => {
		const user = await prisma.user.findUnique({
			where: { cognitoSub: ctx.user.sub },
			include: {
				team: {
					select: {
						id: true,
						name: true,
						inviteCode: true,
					},
				},
			},
		});

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found in database",
			});
		}

		return {
			id: user.id,
			email: user.email,
			username: user.username,
			teamId: user.teamId,
			team: user.team,
			createdAt: user.createdAt,
		};
	}),

	/**
	 * ユーザー名更新
	 * 
	 * 認証済みユーザーの名前を更新します。
	 */
	updateUsername: protectedProcedure
		.input(
			z.object({
				username: z
					.string()
					.min(1, "Username is required")
					.max(50, "Username must be 50 characters or less"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await prisma.user.update({
				where: { cognitoSub: ctx.user.sub },
				data: {
					username: input.username,
				},
			});

			return {
				id: user.id,
				email: user.email,
				username: user.username,
				updatedAt: user.updatedAt,
			};
		}),
});
