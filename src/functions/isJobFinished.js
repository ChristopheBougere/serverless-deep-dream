module.exports.handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));
  console.log(JSON.stringify(context, null, 2));
  return {
    ...event,
    jobFinished: true,
  };
};
