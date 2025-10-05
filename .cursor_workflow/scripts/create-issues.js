#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// issues.jsonを読み込み
const issuesFile = path.join(__dirname, 'issues.json');
const issues = JSON.parse(fs.readFileSync(issuesFile, 'utf-8'));

// Epicマッピング (日本語 -> 英語ラベル)
const epicMapping = {
  'プロジェクト基盤構築': 'Epic:Infrastructure',
  '認証基盤': 'Epic:Authentication',
  'チーム管理': 'Epic:TeamManagement',
  '家事管理': 'Epic:ChoreManagement',
  '家事記録': 'Epic:ChoreLogging',
  'ダッシュボード': 'Epic:Dashboard',
  'テスト・品質保証': 'Epic:Testing',
  'CI/CD・デプロイ': 'Epic:Deployment'
};

const owner = 'SeiyaCM';
const repo = 'KAZIKASHIKA';

console.log(`\n🚀 Creating ${issues.length} GitHub Issues...\n`);

let created = 0;
let failed = 0;

issues.forEach((issue, index) => {
  const issueTitle = `${issue.id}: ${issue.title}`;
  
  // 受け入れ基準をマークダウンリストに変換
  const acceptanceCriteria = issue.acceptance.map(a => `- [ ] ${a}`).join('\n');
  
  // 依存関係をリンクに変換
  const dependencies = issue.dependencies.length > 0
    ? issue.dependencies.map(d => `- #${d}`).join('\n')
    : 'なし';
  
  // Issue本文を作成
  const body = `## ユーザーストーリー
${issue.story}

## 優先度
${issue.priority}

## ストーリーポイント
${issue.points}

## Epic
${issue.epic}

## Sprint
${issue.sprint}

## 受け入れ基準
${acceptanceCriteria}

## 依存関係
${dependencies}
`;

  // ラベルを設定 (優先度、Sprint、Epic)
  const epicLabel = epicMapping[issue.epic] || '';
  const labels = [issue.priority, issue.sprint, epicLabel].filter(Boolean).join(',');
  
  // 一時ファイルに本文を書き込み (文字化け回避)
  const tempFile = path.join(__dirname, `temp-issue-${issue.id}.md`);
  fs.writeFileSync(tempFile, body, 'utf-8');
  
  try {
    console.log(`[${index + 1}/${issues.length}] ${issueTitle}`);
    
    // GitHub CLIでIssue作成
    execSync(
      `gh issue create --repo ${owner}/${repo} --title "${issueTitle}" --body-file "${tempFile}" --label "${labels}"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    
    console.log(`  ✅ Created successfully\n`);
    created++;
    
    // 一時ファイルを削除
    fs.unlinkSync(tempFile);
    
    // API制限対策 (少し待機)
    execSync('timeout /t 1 /nobreak > nul 2>&1', { stdio: 'ignore' });
    
  } catch (error) {
    console.log(`  ❌ Failed: ${error.message}\n`);
    failed++;
    
    // エラーでも一時ファイルを削除
    try {
      fs.unlinkSync(tempFile);
    } catch {}
  }
});

console.log('\n============================================');
console.log('Summary');
console.log('============================================\n');
console.log(`✅ Created: ${created}`);
console.log(`❌ Failed: ${failed}`);
console.log(`\n🎉 Issue creation completed!`);
console.log(`\nNext steps:`);
console.log(`1. Check issues: https://github.com/${owner}/${repo}/issues`);
console.log(`2. Create Sprint milestones`);
console.log(`3. Start implementation phase\n`);
