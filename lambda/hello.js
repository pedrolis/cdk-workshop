exports.handler = async function (event) {
  console.log("Hello Handler, request:", JSON.stringify(event, undefined, 2));

  return sendResponse(200, `Hello, CDK! You've hit ${event.path}\n`);
};

const sendResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: { "Content-Type": "text/plain" },
    body,
  };
};
