import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";

export class DatabaseStack extends cdk.Stack {
	public readonly vpc: ec2.Vpc;
	public readonly database: rds.DatabaseInstance;
	public readonly databaseSecret: secretsmanager.Secret;
	public readonly securityGroup: ec2.SecurityGroup;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// VPC作成
		this.vpc = new ec2.Vpc(this, "KazikashikaVpc", {
			vpcName: "kazikashika-vpc",
			maxAzs: 2, // 2つのAvailability Zone
			natGateways: 1, // NAT Gateway 1つ（コスト削減）
			subnetConfiguration: [
				{
					cidrMask: 24,
					name: "Public",
					subnetType: ec2.SubnetType.PUBLIC,
				},
				{
					cidrMask: 24,
					name: "Private",
					subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
				},
				{
					cidrMask: 28,
					name: "Isolated",
					subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
				},
			],
		});

		// RDS用のSecurity Group作成
		this.securityGroup = new ec2.SecurityGroup(
			this,
			"KazikashikaDbSecurityGroup",
			{
				vpc: this.vpc,
				securityGroupName: "kazikashika-db-sg",
				description: "Security group for KAZIKASHIKA RDS PostgreSQL",
				allowAllOutbound: true,
			},
		);

		// VPC内からのPostgreSQLアクセスを許可
		this.securityGroup.addIngressRule(
			ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
			ec2.Port.tcp(5432),
			"Allow PostgreSQL access from within VPC",
		);

		// データベース認証情報をSecrets Managerで管理
		this.databaseSecret = new secretsmanager.Secret(
			this,
			"KazikashikaDbSecret",
			{
				secretName: "kazikashika-db-credentials",
				description: "KAZIKASHIKA Database credentials",
				generateSecretString: {
					secretStringTemplate: JSON.stringify({ username: "kazikashika" }),
					generateStringKey: "password",
					excludePunctuation: true,
					includeSpace: false,
					passwordLength: 32,
				},
			},
		);

		// RDS PostgreSQL作成
		this.database = new rds.DatabaseInstance(this, "KazikashikaDatabase", {
			instanceIdentifier: "kazikashika-db",
			engine: rds.DatabaseInstanceEngine.postgres({
				version: rds.PostgresEngineVersion.VER_15,
			}),
			instanceType: ec2.InstanceType.of(
				ec2.InstanceClass.T3,
				ec2.InstanceSize.MICRO,
			), // db.t3.micro（コスト削減）
			vpc: this.vpc,
			vpcSubnets: {
				subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
			},
			securityGroups: [this.securityGroup],
			// データベース認証情報
			credentials: rds.Credentials.fromSecret(this.databaseSecret),
			databaseName: "kazikashika",
			// ストレージ設定
			allocatedStorage: 20, // 20GB
			storageType: rds.StorageType.GP2,
			storageEncrypted: true,
			// 可用性設定（コスト削減）
			multiAz: false, // MultiAZ無効
			// バックアップ設定
			backupRetention: cdk.Duration.days(7),
			deleteAutomatedBackups: true,
			// パフォーマンス設定
			enablePerformanceInsights: false, // コスト削減
			// メンテナンス設定
			autoMinorVersionUpgrade: true,
			// 削除保護（開発環境用）
			deletionProtection: false,
			removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用
			// パブリックアクセス無効
			publiclyAccessible: false,
		});

		// CloudFormation出力
		new cdk.CfnOutput(this, "VpcId", {
			value: this.vpc.vpcId,
			description: "VPC ID",
			exportName: "KazikashikaVpcId",
		});

		new cdk.CfnOutput(this, "DatabaseEndpoint", {
			value: this.database.dbInstanceEndpointAddress,
			description: "RDS PostgreSQL Endpoint",
			exportName: "KazikashikaDatabaseEndpoint",
		});

		new cdk.CfnOutput(this, "DatabasePort", {
			value: this.database.dbInstanceEndpointPort,
			description: "RDS PostgreSQL Port",
			exportName: "KazikashikaDatabasePort",
		});

		new cdk.CfnOutput(this, "DatabaseSecretArn", {
			value: this.databaseSecret.secretArn,
			description: "Database credentials secret ARN",
			exportName: "KazikashikaDatabaseSecretArn",
		});

		new cdk.CfnOutput(this, "DatabaseSecurityGroupId", {
			value: this.securityGroup.securityGroupId,
			description: "Database Security Group ID",
			exportName: "KazikashikaDatabaseSecurityGroupId",
		});
	}
}

