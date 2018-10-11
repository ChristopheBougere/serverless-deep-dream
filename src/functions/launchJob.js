const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  if (typeof event.imagePath !== 'string') {
    throw new Error('Missing `imagePath` property.');
  }
  const ecs = new AWS.ECS();
  const taskDefinition = (await ecs.listTaskDefinitions({
    familyPrefix: process.env.TASK_DEFINITION_NAME,
    maxResults: 1,
    sort: 'DESC',
    status: 'ACTIVE',
  }).promise()).taskDefinitionArns[0];
  console.log(`Launching new job for task definition ${taskDefinition}`);
  const res = await ecs.runTask({
    taskDefinition,
    launchType: 'FARGATE',
    cluster: 'serverless-deep-dream-dev',
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: 'ENABLED',
        subnets: [
          process.env.FARGATE_EXEC_SUBNET_ONE,
          process.env.FARGATE_EXEC_SUBNET_TWO,
        ],
      },
    },
  }).promise();
  console.log(`Res: ${JSON.stringify(res, null, 2)}`);
  const { taskArn } = res.tasks[0];
  console.log(`Task arn: ${taskArn}`);
  return {
    ...event,
    taskArn,
  };
};
