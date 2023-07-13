import type { AWS } from "@serverless/typescript";

import createUser from "@functions/createUser";

const serverlessConfiguration: AWS = {
  service: "postConfirmationCognito",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-iam-roles-per-function"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: {
    createUser: {
      ...createUser,
      events: [
        {
          cognitoUserPool: {
            pool: "bybusa7971c06_userpool_a7971c06-dev",
            trigger: "PostConfirmation",
            existing: true,
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
