exports.handler = function (event, context, response) {
  
  response(null, {
    statusCode: 200,
    body: JSON.stringify(event),
  });

};
