import type { AWS } from '@serverless/typescript';

import sendConfirmCode from '@functions/sendConfirmCode';

const serverlessConfiguration: AWS = {
  service: 'customMessageCognito',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },

  // import the function via paths
  functions: { 
    sendConfirmCode:{
      ...sendConfirmCode,
      events:[
        {
          "cognitoUserPool":{
            "pool": "bybusa7971c06_userpool_a7971c06-dev",
            "trigger": "PreSignUp",
            "existing": true
          }
        }
      ]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
