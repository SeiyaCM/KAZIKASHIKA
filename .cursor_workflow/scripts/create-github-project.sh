#!/bin/bash

# GitHub Project作成スクリプト
# このスクリプトはGitHub CLIを使用してProjectとIssuesを作成します

set -e

# リポジトリオーナーと名前を設定
REPO_OWNER="SeiyaCM"
REPO_NAME="KAZIKASHIKA"

echo "🚀 GitHub Project作成を開始します..."

# GitHub CLIがインストールされているか確認
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) がインストールされていません。"
    echo "以下のURLからインストールしてください: https://cli.github.com/"
    exit 1
fi

# GitHub CLIで認証されているか確認
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLIで認証されていません。"
    echo "以下のコマンドで認証してください: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI認証確認完了"

# Projectを作成
echo "📋 GitHub Projectを作成中..."
PROJECT_URL=$(gh project create \
  --owner "$REPO_OWNER" \
  --title "KAZIKASHIKA Development" \
  --format json | jq -r '.url')

if [ -z "$PROJECT_URL" ]; then
    echo "❌ Projectの作成に失敗しました"
    exit 1
fi

echo "✅ Project作成完了: $PROJECT_URL"

# Project IDを取得
PROJECT_ID=$(echo "$PROJECT_URL" | grep -oP '\d+$')
echo "📝 Project ID: $PROJECT_ID"

# Project IDをファイルに保存
echo "$PROJECT_ID" > .cursor_workflow/scripts/project-id.txt

echo ""
echo "✅ GitHub Project作成が完了しました！"
echo "次のステップ: ./create-github-issues.sh を実行してIssuesを作成してください"
