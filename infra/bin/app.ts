#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CognitoStack } from "../lib/cognito-stack";

const app = new cdk.App();

// Cognito Stack
new CognitoStack(app, "KazikashikaCognitoStack", {
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1",
	},
	description: "KAZIKASHIKA Cognito User Pool Stack",
});

app.synth();

