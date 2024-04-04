const { YoutubeTranscript } = require('youtube-transcript');

exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const lines = transcript.map((item) => item.text);
    const text = lines.join(' ');
    return {
      statusCode: 200,
      body: JSON.stringify({ transcript: text }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch transcript' }),
    };
  }
};
