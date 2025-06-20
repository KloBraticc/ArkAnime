const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { path, queryStringParameters } = event;
  const targetPath = path.replace('.netlifyfunctionsproxy', '');

  if (!targetPath) {
    return {
      statusCode 400,
      body JSON.stringify({ error Path required }),
    };
  }

   Build the URL to the real API
  const baseURL = httpsapi.consumet.organime9anime;
  const url = `${baseURL}${targetPath}${queryStringParameters  '' + new URLSearchParams(queryStringParameters).toString()  ''}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode 200,
      headers {
        Access-Control-Allow-Origin ,  allow CORS
        Content-Type applicationjson,
      },
      body JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode 500,
      body JSON.stringify({ error err.message }),
    };
  }
};
