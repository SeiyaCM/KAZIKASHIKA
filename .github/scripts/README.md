# GitHub CLIヘルパースクリプト

このディレクトリには、Windows環境でGitHub CLIを使用する際の文字化けを防ぐためのヘルパースクリプトが含まれています。

## gh-issue-comment.ps1

GitHub Issueにコメントを投稿する際に、日本語の文字化けを防ぐためのPowerShellスクリプトです。

### 使用方法

```powershell
# 基本的な使い方
.\.github\scripts\gh-issue-comment.ps1 -IssueNumber 1 -Body "コメント本文"

# 複数行のコメント
.\.github\scripts\gh-issue-comment.ps1 -IssueNumber 1 -Body @"
実装方針：
1. Prismaスキーマの作成
2. マイグレーションの実行
3. テストの実装
"@
```

### 動作原理

1. PowerShellの出力エンコーディングをUTF-8に設定
2. コメント本文を一時ファイルに保存（BOM無しUTF-8）
3. `gh issue comment --body-file`でファイルから読み込み
4. 一時ファイルを削除

### トラブルシューティング

#### 実行ポリシーエラーが出る場合

PowerShellの実行ポリシーを変更する必要があります：

```powershell
# 現在のユーザーに対して実行ポリシーを変更
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### それでも文字化けする場合

PowerShellプロファイルに以下を追加してください：

```powershell
# PowerShellプロファイルのパスを確認
$PROFILE

# プロファイルを編集（存在しない場合は作成されます）
notepad $PROFILE

# 以下の内容を追加
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
chcp 65001 > $null
```

プロファイルを保存後、PowerShellを再起動してください。

## PowerShell以外の環境

### Windows Terminal / WSL

Windows TerminalやWSLを使用している場合は、`gh issue comment`が正常に動作します：

```bash
gh issue comment 1 --body "日本語のコメント"
```

### Git Bash

Git Bashでも正常に動作します：

```bash
gh issue comment 1 --body "日本語のコメント"
```

## 推奨環境

日本語を扱う開発作業では、以下の環境を推奨します：

1. **Windows Terminal** + PowerShell 7以降
2. **WSL2** (Ubuntu等)
3. **Git Bash**

これらの環境では、デフォルトでUTF-8が使用されるため、文字化けが発生しません。

