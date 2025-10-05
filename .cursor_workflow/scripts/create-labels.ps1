# GitHub ラベル一括作成スクリプト (PowerShell)
# 使用方法: .\create-labels.ps1

param(
    [string]$Owner = "SeiyaCM",
    [string]$Repo = "KAZIKASHIKA"
)

$ErrorActionPreference = "Stop"

Write-Host "🏷️  GitHub ラベル作成を開始します..." -ForegroundColor Green
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
Write-Host "対象リポジトリ: $Owner/$Repo" -ForegroundColor Cyan
Write-Host ""

# ラベル作成関数
function Create-Label {
    param(
        [string]$Name,
        [string]$Color,
        [string]$Description
    )
    
    try {
        gh label create $Name `
            --color $Color `
            --description $Description `
            --repo "$Owner/$Repo" 2>&1 | Out-Null
        Write-Host "  ✅ $Name" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "  ⏭️  $Name (既に存在)" -ForegroundColor Yellow
        } else {
            Write-Host "  ❌ $Name : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 優先度ラベル
Write-Host "優先度ラベルを作成中..." -ForegroundColor Cyan
Create-Label -Name "P0" -Color "d73a4a" -Description "Critical - MVP必須機能"
Create-Label -Name "P1" -Color "fbca04" -Description "High - 早期リリース必要機能"
Create-Label -Name "P2" -Color "0e8a16" -Description "Medium - リリース後追加可能機能"

Write-Host ""

# Sprintラベル
Write-Host "Sprintラベルを作成中..." -ForegroundColor Cyan
Create-Label -Name "Sprint-0" -Color "0052cc" -Description "Week 0: プロジェクト初期設定"
Create-Label -Name "Sprint-1" -Color "0052cc" -Description "Week 1-2: 認証とインフラ基盤"
Create-Label -Name "Sprint-2" -Color "0052cc" -Description "Week 3-4: チーム管理と家事管理"
Create-Label -Name "Sprint-3" -Color "0052cc" -Description "Week 5-6: 家事記録とダッシュボード"
Create-Label -Name "Sprint-4" -Color "0052cc" -Description "Week 7-8: テスト・CI/CD・デプロイ"

Write-Host ""

# Epicラベル
Write-Host "Epicラベルを作成中..." -ForegroundColor Cyan
Create-Label -Name "Epic:基盤構築" -Color "5319e7" -Description "プロジェクト基盤構築"
Create-Label -Name "Epic:認証基盤" -Color "5319e7" -Description "認証基盤"
Create-Label -Name "Epic:チーム管理" -Color "5319e7" -Description "チーム管理"
Create-Label -Name "Epic:家事管理" -Color "5319e7" -Description "家事管理"
Create-Label -Name "Epic:家事記録" -Color "5319e7" -Description "家事記録"
Create-Label -Name "Epic:ダッシュボード" -Color "5319e7" -Description "ダッシュボード"
Create-Label -Name "Epic:テスト" -Color "5319e7" -Description "テスト・品質保証"
Create-Label -Name "Epic:デプロイ" -Color "5319e7" -Description "CI/CD・デプロイ"

Write-Host ""
Write-Host "🎉 ラベル作成が完了しました！" -ForegroundColor Green
Write-Host ""
Write-Host "次のステップ: .\create-issues.ps1 を実行してIssuesを作成してください" -ForegroundColor Cyan
