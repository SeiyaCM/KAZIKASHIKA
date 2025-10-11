import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import type { Construct } from "constructs";

export class CognitoStack extends cdk.Stack {
	public readonly userPool: cognito.UserPool;
	public readonly userPoolClient: cognito.UserPoolClient;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Cognito User Pool作成
		this.userPool = new cognito.UserPool(this, "KazikashikaUserPool", {
			userPoolName: "kazikashika-user-pool",
			// メールアドレスでサインイン
			signInAliases: {
				email: true,
				username: false,
			},
			// セルフサービスサインアップを有効化
			selfSignUpEnabled: true,
			// メール検証を必須化
			autoVerify: {
				email: true,
			},
			// パスワードポリシー
			passwordPolicy: {
				minLength: 8,
				requireLowercase: true,
				requireUppercase: true,
				requireDigits: true,
				requireSymbols: false, // コスト削減のため記号は不要
			},
			// MFA無効（コスト削減）
			mfa: cognito.Mfa.OFF,
			// アカウント回復設定
			accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
			// ユーザー属性
			standardAttributes: {
				email: {
					required: true,
					mutable: true,
				},
			},
			customAttributes: {
				username: new cognito.StringAttribute({ minLen: 1, maxLen: 50 }),
			},
			// ユーザー削除保護（本番環境では有効化を検討）
			removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用
		});

		// User Pool Client作成
		this.userPoolClient = new cognito.UserPoolClient(
			this,
			"KazikashikaUserPoolClient",
			{
				userPool: this.userPool,
				userPoolClientName: "kazikashika-web-client",
				// 認証フロー設定
				authFlows: {
					userPassword: true, // USER_PASSWORD_AUTH有効
					userSrp: true, // SRP認証も有効
					custom: false,
					adminUserPassword: false,
				},
				// OAuth設定（将来的にソーシャルログイン追加の可能性）
				oAuth: {
					flows: {
						authorizationCodeGrant: false,
						implicitCodeGrant: false,
					},
				},
				// セキュリティ設定
				preventUserExistenceErrors: true,
				// トークンの有効期限
				accessTokenValidity: cdk.Duration.hours(1),
				idTokenValidity: cdk.Duration.hours(1),
				refreshTokenValidity: cdk.Duration.days(30),
			},
		);

		// CloudFormation出力
		new cdk.CfnOutput(this, "UserPoolId", {
			value: this.userPool.userPoolId,
			description: "Cognito User Pool ID",
			exportName: "KazikashikaUserPoolId",
		});

		new cdk.CfnOutput(this, "UserPoolClientId", {
			value: this.userPoolClient.userPoolClientId,
			description: "Cognito User Pool Client ID",
			exportName: "KazikashikaUserPoolClientId",
		});

		new cdk.CfnOutput(this, "UserPoolArn", {
			value: this.userPool.userPoolArn,
			description: "Cognito User Pool ARN",
			exportName: "KazikashikaUserPoolArn",
		});
	}
}

