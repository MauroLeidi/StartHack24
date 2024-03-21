import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner you want to use

const BrazilMap = ({ year }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLandcoverHtml = async () => {
      setIsLoading(true);
      const payload = {
        layers: ['biomes', 'landcover_' + year, 'burn_' + year],
      };

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
          setIsLoading(false);
        } else {
          console.error('Failed to fetch HTML');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching HTML:', error);
        setIsLoading(false);
      }
    };

    fetchLandcoverHtml();
  }, [year]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        margin: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isLoading ? (
        <ClipLoader color="#007bff" size={150} /> // Use the ClipLoader spinner
      ) : (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
};

export default BrazilMap;
