#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CognitoStack } from "../lib/cognito-stack";
import { DatabaseStack } from "../lib/database-stack";

const app = new cdk.App();

// 共通の環境設定
const env = {
	account: process.env.CDK_DEFAULT_ACCOUNT,
	region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1",
};

// Cognito Stack
new CognitoStack(app, "KazikashikaCognitoStack", {
	env,
	description: "KAZIKASHIKA Cognito User Pool Stack",
});

// Database Stack
new DatabaseStack(app, "KazikashikaDatabaseStack", {
	env,
	description: "KAZIKASHIKA VPC and RDS PostgreSQL Stack",
});

app.synth();

