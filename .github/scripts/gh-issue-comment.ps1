# gh issue comment用のヘルパースクリプト
# 日本語の文字化けを防ぐために、UTF-8エンコーディングを明示的に設定します

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$Body
)

# 出力エンコーディングをUTF-8に設定
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

# PSDefaultParameterValuesでOut-Fileのエンコーディングを設定
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'

# 一時ファイルにコメント本文を保存（BOM無しUTF-8）
$tempFile = [System.IO.Path]::GetTempFileName()
try {
    # BOM無しUTF-8で書き込み
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($tempFile, $Body, $utf8NoBom)
    
    # gh コマンドを実行
    gh issue comment $IssueNumber --body-file $tempFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Issue #$IssueNumber にコメントを投稿しました" -ForegroundColor Green
    } else {
        Write-Host "❌ コメントの投稿に失敗しました (終了コード: $LASTEXITCODE)" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} finally {
    # 一時ファイルを削除
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force
    }
}

