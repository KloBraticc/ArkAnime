const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // Remove the proxy function prefix from the path
    const path = event.path.replace('/.netlify/functions/proxy', '');

    // Build the 9anime API URL with the same path + query string
    const apiUrl = `https://api.consumet.org/anime/9anime${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `External API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
