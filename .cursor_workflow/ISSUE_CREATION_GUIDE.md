# GitHub Issue作成ガイド

このガイドでは、KAZIKASHIKA開発プロジェクトのGitHub IssuesとProjectを作成する手順を説明します。

## 🎯 目標

実装計画書に基づいて、**48個のユーザーストーリー**をGitHub Issuesとして作成し、GitHub Projectで管理できるようにします。

## 📋 事前準備

### 1. GitHub CLIのインストール

```powershell
# wingetでインストール
winget install GitHub.cli

# または https://cli.github.com/ からダウンロード
```

### 2. GitHub CLIで認証

```powershell
gh auth login
```

ブラウザで認証を完了してください。

## 🚀 実行手順

### ステップ1: GitHub Projectの作成（手動）

1. GitHub Projectsにアクセス: https://github.com/SeiyaCM/KAZIKASHIKA/projects
2. 「New project」ボタンをクリック
3. 以下の設定でProjectを作成:
   - **Project name**: `KAZIKASHIKA Development`
   - **Template**: `Board` を選択
4. 作成完了

### ステップ2: ラベルの作成

スクリプトディレクトリに移動してラベル作成スクリプトを実行:

```powershell
cd .cursor_workflow\scripts
.\create-labels.ps1
```

**作成されるラベル:**
- 優先度: `P0`, `P1`, `P2`
- Sprint: `Sprint-0`, `Sprint-1`, `Sprint-2`, `Sprint-3`, `Sprint-4`
- Epic: `Epic:基盤構築`, `Epic:認証基盤`, など8種類

### ステップ3: Issuesの作成

Issue作成スクリプトを実行:

```powershell
.\create-issues.ps1
```

スクリプトが48個のIssueを自動作成します（約1-2分かかります）。

### ステップ4: 確認

1. GitHub Issuesを確認: https://github.com/SeiyaCM/KAZIKASHIKA/issues
2. 48個のIssueが作成されていることを確認
3. 各Issueに適切なラベルが付与されていることを確認

### ステップ5: Sprintマイルストーンの作成（オプション）

GitHub Milestonesを作成して、各IssueにSprintを割り当てることができます:

1. GitHub Milestones: https://github.com/SeiyaCM/KAZIKASHIKA/milestones
2. 「New milestone」で以下を作成:
   - Sprint 0: プロジェクト初期設定
   - Sprint 1: 認証とインフラ基盤
   - Sprint 2: チーム管理と家事管理
   - Sprint 3: 家事記録とダッシュボード
   - Sprint 4: テスト・CI/CD・デプロイ

### ステップ6: GitHub Projectでボード管理

1. 作成したProjectを開く
2. 「Add items」ボタンから作成したIssuesを追加
3. ステータス列を設定（例: `📋 Backlog`, `🚀 Todo`, `⚙️ In Progress`, `✅ Done`）
4. IssuesをSprintごとに整理

## 📊 作成されるIssue構成

### スプリント別

| Sprint | Issue数 | ポイント |
|--------|---------|---------|
| Sprint-0 | 7 | 19 |
| Sprint-1 | 7 | 34 |
| Sprint-2 | 11 | 38 |
| Sprint-3 | 9 | 35 |
| Sprint-4 | 14 | 62 |
| **合計** | **48** | **188** |

### Epic別

| Epic | Issue数 |
|------|---------|
| プロジェクト基盤構築 | 7 |
| 認証基盤 | 7 |
| チーム管理 | 4 |
| 家事管理 | 7 |
| 家事記録 | 6 |
| ダッシュボード | 4 |
| テスト・品質保証 | 6 |
| CI/CD・デプロイ | 7 |

## 🔧 トラブルシューティング

### Q: "gh: command not found" エラーが出る
**A:** GitHub CLIがインストールされていません。[事前準備](#事前準備)を確認してください。

### Q: "Not authenticated" エラーが出る
**A:** GitHub CLIで認証が必要です:
```powershell
gh auth login
```

### Q: ラベルが既に存在するエラーが出る
**A:** 問題ありません。既存のラベルはスキップされます。

### Q: Issue作成が途中で止まった
**A:** スクリプトを再実行してください。既存のIssueはスキップされます。

### Q: API制限エラーが出る
**A:** GitHubのAPI制限に達しました。1時間ほど待ってから再実行してください。

## 📝 Issue作成後のワークフロー

1. **Sprintの開始**
   - Sprint 0から順次着手
   - 各Issueを「In Progress」に移動

2. **作業ブランチの作成**
   ```bash
   git checkout -b feature/US-001-monorepo-setup
   ```

3. **実装とテスト**
   - Issue の受け入れ基準を満たすように実装
   - ユニットテスト作成
   - Lintチェック

4. **Pull Request作成**
   ```bash
   gh pr create --title "US-001: モノレポ初期設定" --body "Closes #1"
   ```

5. **レビューとマージ**
   - コードレビュー完了後、mainブランチにマージ
   - Issueを「Done」に移動

6. **次のIssueへ**
   - 依存関係を確認して次のIssueに着手

## 🎯 次のステップ

Issue作成が完了したら、**実行フェーズ**に進みます。

詳細は `.cursor\rules\spec.mdc` の「5. 実行フェーズ」を参照してください。

---

**issue作成フェーズが完了しました。実行フェーズに進んでよろしいですか？**
