# GitHub Project & Issues 作成スクリプト

このディレクトリには、KAZIKASHIKA開発プロジェクトのGitHub ProjectとIssuesを自動作成するスクリプトが含まれています。

## 📋 概要

実装計画書(`.cursor_workflow/specs/implementations.md`)に基づいて、**48個のユーザーストーリー**をGitHub Issuesとして作成します。

## 🚀 使用方法

### 前提条件

1. **GitHub CLIのインストール**
   ```powershell
   winget install GitHub.cli
   ```
   または [https://cli.github.com/](https://cli.github.com/) からダウンロード

2. **GitHub CLIで認証**
   ```powershell
   gh auth login
   ```
   ブラウザで認証を完了してください

### ステップ1: GitHub Projectの作成

**手動でProjectを作成してください:**

1. GitHub Projectsにアクセス: https://github.com/SeiyaCM/KAZIKASHIKA/projects
2. 「New project」をクリック
3. プロジェクト名: `KAZIKASHIKA Development`
4. テンプレート: `Board` を選択
5. 作成完了

### ステップ2: GitHub Issuesの作成

PowerShellスクリプトを実行してIssuesを作成します:

```powershell
# スクリプトディレクトリに移動
cd .cursor_workflow\scripts

# PowerShellスクリプトを実行
.\create-issues.ps1
```

または、パラメータを指定して実行:

```powershell
.\create-issues.ps1 -Owner "SeiyaCM" -Repo "KAZIKASHIKA"
```

### ステップ3: 確認

1. GitHub Issuesを確認: https://github.com/SeiyaCM/KAZIKASHIKA/issues
2. 48個のIssueが作成されていることを確認
3. 各IssueにラベルとSprintタグが付与されていることを確認

## 📂 ファイル構成

```
.cursor_workflow/scripts/
├── README.md                   # このファイル
├── issues.json                 # 48個のIssue定義（JSON形式）
├── create-issues.ps1           # Issue作成スクリプト（PowerShell）
├── create-github-project.sh    # Project作成スクリプト（Bash/参考用）
└── create-github-issues.sh     # Issue作成スクリプト（Bash/参考用）
```

## 📊 Issue構成

### スプリント別の内訳

| Sprint | Issue数 | ストーリーポイント |
|--------|---------|------------------|
| Sprint-0 | 7 | 19 |
| Sprint-1 | 7 | 34 |
| Sprint-2 | 11 | 38 |
| Sprint-3 | 9 | 35 |
| Sprint-4 | 14 | 62 |
| **合計** | **48** | **188** |

### Epic別の内訳

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

### 優先度別の内訳

| 優先度 | Issue数 | 説明 |
|-------|---------|------|
| P0 | 30 | MVP必須機能 |
| P1 | 14 | 早期リリース必要機能 |
| P2 | 4 | リリース後追加可能 |

## 🏷️ ラベル一覧

Issues作成時に自動で付与されるラベル:

- **優先度**: `P0`, `P1`, `P2`
- **Sprint**: `Sprint-0`, `Sprint-1`, `Sprint-2`, `Sprint-3`, `Sprint-4`
- **Epic**: 手動で追加推奨
  - `Epic:基盤構築`
  - `Epic:認証基盤`
  - `Epic:チーム管理`
  - `Epic:家事管理`
  - `Epic:家事記録`
  - `Epic:ダッシュボード`
  - `Epic:テスト`
  - `Epic:デプロイ`

### ラベルの作成（事前準備）

以下のコマンドで必要なラベルを一括作成できます:

```powershell
# 優先度ラベル
gh label create "P0" --color "d73a4a" --description "Critical - MVP必須" --repo SeiyaCM/KAZIKASHIKA
gh label create "P1" --color "fbca04" --description "High - 早期リリース必要" --repo SeiyaCM/KAZIKASHIKA
gh label create "P2" --color "0e8a16" --description "Medium - リリース後追加可能" --repo SeiyaCM/KAZIKASHIKA

# Sprintラベル
gh label create "Sprint-0" --color "0052cc" --description "Week 0: 初期設定" --repo SeiyaCM/KAZIKASHIKA
gh label create "Sprint-1" --color "0052cc" --description "Week 1-2: 認証とインフラ" --repo SeiyaCM/KAZIKASHIKA
gh label create "Sprint-2" --color "0052cc" --description "Week 3-4: チーム・家事管理" --repo SeiyaCM/KAZIKASHIKA
gh label create "Sprint-3" --color "0052cc" --description "Week 5-6: 記録・ダッシュボード" --repo SeiyaCM/KAZIKASHIKA
gh label create "Sprint-4" --color "0052cc" --description "Week 7-8: テスト・デプロイ" --repo SeiyaCM/KAZIKASHIKA

# Epicラベル
gh label create "Epic:基盤構築" --color "5319e7" --description "プロジェクト基盤構築" --repo SeiyaCM/KAZIKASHIKA
gh label create "Epic:認証基盤" --color "5319e7" --description "認証基盤" --repo SeiyaCM/KAZIKASHIKA
gh label create "Epic:チーム管理" --color "5319e7" --description "チーム管理" --repo SeiyaCM/KAZIKASHIKA
gh label create "Epic:家事管理" --color "5319e7" --description "家事管理" --repo SeiyaCM/KAZIKASHIKA
gh label create "Epic:家事記録" --color "5319e7" --description "家事記録" --repo SeiyaCM/KAZIKASHIKA
gh label create "Epic:ダッシュボード" --color "5319e7" --description "ダッシュボード" --repo SeiyaCM/KAZIKASHIKA
gh label create "Epic:テスト" --color "5319e7" --description "テスト・品質保証" --repo SeiyaCM/KAZIKASHIKA
gh label create "Epic:デプロイ" --color "5319e7" --description "CI/CD・デプロイ" --repo SeiyaCM/KAZIKASHIKA
```

## 📝 Issueフォーマット

各Issueは以下の情報を含みます:

```markdown
## ユーザーストーリー
（As a ... I want to ... so that ...）

## 優先度
P0 (Critical)

## ストーリーポイント
3

## Epic
プロジェクト基盤構築

## Sprint
Sprint-0

## 受け入れ基準
- [ ] 基準1
- [ ] 基準2
- [ ] 基準3

## 依存関係
- #US-001
- #US-002
```

## 🔧 トラブルシューティング

### エラー: "gh: command not found"
GitHub CLIがインストールされていません。[前提条件](#前提条件)を確認してください。

### エラー: "Not authenticated"
GitHub CLIで認証が必要です:
```powershell
gh auth login
```

### エラー: "rate limit exceeded"
GitHubのAPI制限に達しました。しばらく待ってから再実行してください。

### Issue作成が途中で止まった場合
スクリプトを再実行すると、既存のIssueはスキップされます（タイトルで判定）。

## 📌 次のステップ

Issue作成後:

1. **Sprintマイルストーンの作成**
   - Sprint-0, Sprint-1, Sprint-2, Sprint-3, Sprint-4
   - 各Issueにマイルストーンを割り当て

2. **GitHub Projectでボード管理**
   - IssuesをProjectに追加
   - ステータス列の設定（Todo, In Progress, Done）

3. **実行フェーズの開始**
   - Sprint 0から順次着手
   - 各Issueに対して作業ブランチを作成
   - Pull Request作成・レビュー・マージ

## 📚 参考リンク

- [実装計画書](./../specs/implementations.md)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub Projects Guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects)

---

作成日: 2025-10-05  
更新日: 2025-10-05
