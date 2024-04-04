import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (event) => {
    setYoutubeUrl(event.target.value);
    setErrorMessage('');
  };

  const handleDownloadTranscript = () => {
    setIsLoading(true);
    setErrorMessage('');
    fetch(`/.netlify/functions/transcript?url=${encodeURIComponent(youtubeUrl)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setTranscript(data.transcript);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('An error occurred while fetching the transcript. Please check the URL and try again.');
        setIsLoading(false);
      });
  };

  const handleDownloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(transcript)
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        console.error('Failed to copy transcript:', error);
      });
  };

  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [copied]);

  return (
    <div className="app">
      <h1>YouTube Transcript Downloader</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={youtubeUrl}
          onChange={handleInputChange}
        />
        <button onClick={handleDownloadTranscript} disabled={isLoading}>
          {isLoading ? 'Downloading...' : 'Download Transcript'}
        </button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {transcript && (
        <div className="transcript-container">
          <div className="transcript-header">
            <h2>Transcript:</h2>
            <button
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopyTranscript}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="transcript-scroll">
            <pre>{transcript}</pre>
          </div>
          <div className="download-button-container">
            <button onClick={handleDownloadText}>Download Transcript as Text</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;