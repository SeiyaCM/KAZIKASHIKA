# PowerShell環境設定ガイド

このドキュメントでは、Windows PowerShellで日本語を含むコマンドを正しく実行するための設定方法を説明します。

## 問題

Windows PowerShellのデフォルト設定では、以下の問題が発生する可能性があります：

- `gh issue comment`で日本語コメントが文字化けする
- Git のコミットメッセージが文字化けする
- ファイル名に日本語が含まれる場合の表示問題

## 恒久対策：PowerShellプロファイルの設定

### 1. PowerShellプロファイルの場所を確認

PowerShellを開いて以下のコマンドを実行：

```powershell
$PROFILE
```

出力例：`C:\Users\YourName\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`

### 2. プロファイルディレクトリを作成（存在しない場合）

```powershell
$profileDir = Split-Path -Parent $PROFILE
if (-not (Test-Path $profileDir)) {
    New-Item -Path $profileDir -ItemType Directory -Force
}
```

### 3. プロファイルファイルを編集

```powershell
# Visual Studio Codeで開く
code $PROFILE

# または、メモ帳で開く
notepad $PROFILE
```

### 4. 以下の内容を追加

```powershell
# ========================================
# UTF-8エンコーディング設定
# ========================================

# PowerShellの入出力エンコーディングをUTF-8に設定
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

# すべてのコマンドレットでUTF-8を使用
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# コンソールのコードページをUTF-8に設定（65001）
# エラー出力を抑制するため、$nullにリダイレクト
chcp 65001 > $null

# ========================================
# その他の便利な設定（オプション）
# ========================================

# プロンプトのカスタマイズ（Git情報を表示）
# posh-gitがインストールされている場合
if (Get-Module -ListAvailable -Name posh-git) {
    Import-Module posh-git
}

# オートコンプリートの改善
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# エイリアスの設定
Set-Alias -Name gh-comment -Value "$PSScriptRoot\.github\scripts\gh-issue-comment.ps1" -ErrorAction SilentlyContinue
```

### 5. 実行ポリシーの設定

PowerShellスクリプトを実行するには、実行ポリシーを変更する必要があります：

```powershell
# 管理者権限不要（推奨）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 確認メッセージが表示されたら「Y」を入力
```

### 6. PowerShellを再起動

設定を反映するため、PowerShellを一度閉じて再度開きます。

### 7. 動作確認

```powershell
# エンコーディングの確認
$OutputEncoding
[Console]::OutputEncoding
[Console]::InputEncoding

# すべてUTF-8（Code page: 65001）と表示されればOK

# gh issue commentのテスト（実際のIssue番号に置き換えてください）
.\.github\scripts\gh-issue-comment.ps1 -IssueNumber 1 -Body "日本語のテストコメント"
```

## 一時的な対策（プロファイル設定をしない場合）

プロファイルを編集したくない場合は、PowerShellを起動するたびに以下のコマンドを実行してください：

```powershell
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 > $null
```

## 代替案：より良い開発環境

PowerShellの設定が面倒な場合は、以下の環境を使用することを推奨します：

### 1. Windows Terminal + PowerShell 7

```powershell
# PowerShell 7のインストール（winget使用）
winget install Microsoft.PowerShell

# Windows Terminalのインストール
winget install Microsoft.WindowsTerminal
```

Windows TerminalとPowerShell 7の組み合わせは、デフォルトでUTF-8が有効になっています。

### 2. WSL2（Windows Subsystem for Linux）

```powershell
# WSL2のインストール
wsl --install

# Ubuntu等をインストール後、WSL環境でGit操作を実施
wsl
```

WSL2では、Linuxネイティブ環境が使用できるため、文字エンコーディングの問題は発生しません。

### 3. Git Bash

Git for Windowsに付属のGit Bashは、Unix系のシェル環境を提供し、UTF-8がデフォルトで使用されます。

```bash
# Git Bashで実行
gh issue comment 1 --body "日本語のコメント"
```

## トラブルシューティング

### プロファイルが読み込まれない

PowerShellを管理者権限で実行しているか確認してください。通常のユーザー権限とは別のプロファイルが使用されます。

### スクリプト実行時に「このシステムではスクリプトの実行が無効になっています」エラー

実行ポリシーを確認・変更してください：

```powershell
# 現在の実行ポリシーを確認
Get-ExecutionPolicy

# ユーザースコープで変更
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### それでも文字化けする

1. Windows Terminalを使用する
2. PowerShell 7以降を使用する
3. WSL2を使用する
4. Visual Studio Codeの統合ターミナルを使用する（デフォルトでUTF-8）

## 参考リンク

- [PowerShell 実行ポリシー](https://docs.microsoft.com/ja-jp/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [PowerShell プロファイル](https://docs.microsoft.com/ja-jp/powershell/module/microsoft.powershell.core/about/about_profiles)
- [Windows Terminal](https://docs.microsoft.com/ja-jp/windows/terminal/)
- [WSL2](https://docs.microsoft.com/ja-jp/windows/wsl/install)

