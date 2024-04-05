const ycs = require('youtube-captions-scraper');

exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;

  try {
    const videoId = getVideoIdFromUrl(url);
    const captions = await ycs.getSubtitles({ videoID: videoId, lang: 'en' });
    const transcript = captions.map((caption) => caption.text).join(' ');

    return {
      statusCode: 200,
      body: JSON.stringify({ transcript }),
    };
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch transcript' }),
    };
  }
};

function getVideoIdFromUrl(url) {
  const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const match = url.match(videoIdRegex);
  return match ? match[1] : null;
}