import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Define the function that fetches the HTML
    const fetchLandcoverHtml = async () => {
      // Your payload, adjust the years as needed
      const payload = {
        years: [2014, 2015] // Example years
      };

      // Fetch the HTML from the FastAPI endpoint
      try {
        const response = await fetch('http://localhost:8000/landcover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const html = await response.text();
          setHtmlContent(html);
        } else {
          console.error('Failed to fetch HTML');
        }
      } catch (error) {
        console.error('Error fetching HTML:', error);
      }
    };

    // Call the function
    fetchLandcoverHtml();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* Dangerously set inner HTML */}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </header>
    </div>
  );
}

export default App;
