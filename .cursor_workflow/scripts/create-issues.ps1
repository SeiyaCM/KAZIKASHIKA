# GitHub Issues作成スクリプト (PowerShell)
# 使用方法: .\create-issues.ps1

param(
    [string]$Owner = "SeiyaCM",
    [string]$Repo = "KAZIKASHIKA"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 GitHub Issues作成を開始します..." -ForegroundColor Green
Write-Host ""

# GitHub CLIの確認
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI確認: $($ghVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLIがインストールされていません" -ForegroundColor Red
    Write-Host "以下のURLからインストールしてください: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# 認証確認
try {
    gh auth status 2>&1 | Out-Null
    Write-Host "✅ GitHub CLI認証確認完了" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLIで認証されていません" -ForegroundColor Red
    Write-Host "以下のコマンドで認証してください: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "GitHub Projectの作成" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Projectの作成
Write-Host "📋 GitHub Projectを作成中..." -ForegroundColor Yellow

try {
    # Project作成（既に存在する場合はスキップ）
    $projectTitle = "KAZIKASHIKA Development"
    
    Write-Host "Project名: $projectTitle" -ForegroundColor White
    Write-Host "リポジトリ: $Owner/$Repo" -ForegroundColor White
    Write-Host ""
    Write-Host "注意: GitHub Projects (beta)を使用します" -ForegroundColor Yellow
    Write-Host "手動でProjectを作成してください: https://github.com/$Owner/$Repo/projects" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Projectを作成しましたか？ (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ 処理を中断しました" -ForegroundColor Red
        exit 0
    }
    
} catch {
    Write-Host "⚠️ Project作成をスキップします（手動で作成してください）" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "GitHub Issuesの作成" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# issues.jsonの読み込み
$issuesFile = Join-Path $PSScriptRoot "issues.json"
if (-not (Test-Path $issuesFile)) {
    Write-Host "❌ issues.jsonが見つかりません: $issuesFile" -ForegroundColor Red
    exit 1
}

$issues = Get-Content $issuesFile -Raw | ConvertFrom-Json
Write-Host "📄 $($issues.Count) 個のIssueを読み込みました" -ForegroundColor Green
Write-Host ""

# Issueカウンター
$created = 0
$skipped = 0
$failed = 0

foreach ($issue in $issues) {
    Write-Host "[$($issue.id)] $($issue.title)" -ForegroundColor White
    
    # Issue本文の生成
    $body = @"
## ユーザーストーリー
$($issue.story)

## 優先度
$($issue.priority)

## ストーリーポイント
$($issue.points)

## Epic
$($issue.epic)

## Sprint
$($issue.sprint)

## 受け入れ基準
$($issue.acceptance | ForEach-Object { "- [ ] $_" } | Out-String)

## 依存関係
$($issue.dependencies | ForEach-Object { "- #$_" } | Out-String)
"@
    
    # ラベル設定
    $labels = "$($issue.priority),$($issue.sprint)"
    
    try {
        # Issue作成
        $issueTitle = "$($issue.id): $($issue.title)"
        
        gh issue create `
            --repo "$Owner/$Repo" `
            --title $issueTitle `
            --body $body `
            --label $labels | Out-Null
        
        Write-Host "  ✅ 作成完了" -ForegroundColor Green
        $created++
        
        # レート制限対策（少し待機）
        Start-Sleep -Milliseconds 500
        
    } catch {
        Write-Host "  ❌ 作成失敗: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "結果サマリー" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ 作成成功: $created 個" -ForegroundColor Green
Write-Host "⏭️  スキップ: $skipped 個" -ForegroundColor Yellow
Write-Host "❌ 失敗: $failed 個" -ForegroundColor Red
Write-Host ""

if ($created -gt 0) {
    Write-Host "🎉 GitHub Issuesの作成が完了しました！" -ForegroundColor Green
    Write-Host ""
    Write-Host "次のステップ:" -ForegroundColor Cyan
    Write-Host "1. GitHub Issues を確認: https://github.com/$Owner/$Repo/issues" -ForegroundColor White
    Write-Host "2. Sprintマイルストーンを作成" -ForegroundColor White
    Write-Host "3. 実行フェーズの開始" -ForegroundColor White
} else {
    Write-Host "⚠️ Issueが作成されませんでした" -ForegroundColor Yellow
}
