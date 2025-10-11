/**
 * デフォルト家事リスト
 * 
 * チーム作成時に自動的に追加される家事の一覧
 */

export const DEFAULT_CHORES = [
	"食器洗い",
	"洗濯",
	"掃除機がけ",
	"ゴミ出し",
	"料理",
	"風呂掃除",
	"トイレ掃除",
	"買い物",
	"洗濯物を畳む",
	"布団干し",
] as const;

/**
 * デフォルト家事の型
 */
export type DefaultChore = (typeof DEFAULT_CHORES)[number];
