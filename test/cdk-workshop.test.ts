import * as cdk from "aws-cdk-lib";
import { Template, Match, Capture } from "aws-cdk-lib/assertions";
import * as CdkWorkshop from "../lib/cdk-workshop-stack";

xtest("SQS Queue and SNS Topic Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkWorkshop.CdkWorkshopStack(app, "MyTestStack");
  // THEN

  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::SQS::Queue", {
    VisibilityTimeout: 300,
  });
  template.resourceCountIs("AWS::SNS::Topic", 1);
});

import * as lambda from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../lib/hitcounter";

test("DynamoDB Table Created", () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
  });
  // THEN

  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test("Lambda Has Environment Variables", () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
  });
  // THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: "TestFunction22AD90FC",
      },
      HITS_TABLE_NAME: {
        Ref: "MyTestConstructHits24A357F0",
      },
    },
  });
});


xtest('DynamoDB Table Created With Encryption', () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream:  new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('lambda')
    })
  });
  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    SSESpecification: {
      SSEEnabled: true
    }
  });
});
