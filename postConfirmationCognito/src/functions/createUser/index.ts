import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.createUserHandler`,
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:PutItem"],
      Resource: [
        "arn:aws:dynamodb:us-east-1:074471573912:table/User-ki5pvxbboveshfzsai4wd4dsmq-dev",
      ],
    },
  ]
};
