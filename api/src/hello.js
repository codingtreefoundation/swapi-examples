const handler = function (event, context, response) {
  const { HELLO_ENV } = process.env;

  response(null, {
    statusCode: 200,
    body: JSON.stringify({
      event,
      context,
      env: {
        hello: HELLO_ENV,
      },
    }),
  });
};

exports.handler = handler;
