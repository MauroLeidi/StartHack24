import React, { useEffect, useState } from "react";
import logo from "./logo.svg"; // Make sure your logo is correctly imported
import "./App.css";
import { Card, Box, Slider } from "@mui/material";
import View1 from "./components/view1";
import View2 from "./components/view2";

function App() {
    const [htmlContent, setHtmlContent] = useState("");
    const [view, setView] = useState(1);
    const [year, setYear] = useState(2010);

    const marks = [];
    for (let year = 2010; year <= 2020; year++) {
        marks.push({value: year, label: `${year}`});
    }

    const handleYearChange = (event, newValue) => {
        setYear(newValue);
    };

  useEffect(() => {
    // Define the function that fetches the HTML
    const fetchLandcoverHtml = async () => {
      // Your payload, adjust the years as needed
      const payload = {
        layers: ["landcover_2017","burn_2017"], // Example years
      };

      // Fetch the HTML from the FastAPI endpoint
      try {
        const response = await fetch("http://localhost:8000/landcover", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const html = await response.text();
          setHtmlContent(html);
        } else {
          console.error("Failed to fetch HTML");
        }
      } catch (error) {
        console.error("Error fetching HTML:", error);
      }
    };

    // Call the function
    fetchLandcoverHtml();
  }, []); // Empty dependency array means this effect runs only once after the initial render

    const MenuItem = ({viewId, children}) => (
        <div
            onClick={() => setView(viewId)}
            style={{
                width: '90%',
                cursor: 'pointer',
                padding: '10px 0',
                margin: '10px auto',
                backgroundColor: view === viewId ? '#f0f0f0' : 'transparent',
                textAlign: 'center',
                borderRadius: '5px',
                transition: 'background-color 0.3s',
            }}
        >
            {children}
        </div>
    );

    return (
        <div className="App" style={{
            display: 'flex',
            minHeight: '100vh',
            boxSizing: 'border-box',
            paddingTop: '20px',
            paddingBottom: '20px',
            paddingLeft: '20px'
        }}>
            {/* Navigation Card on the Left */}
            <Card elevation={3} style={{
                width: '250px',
                marginRight: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '20px'
            }}>
                {/* Logo Placeholder */}
                <Box
                    sx={{
                        width: '100%',
                        height: 120,
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        marginBottom: '20px',
                    }}
                />

                {/* Menu Items */}
                <MenuItem viewId={1}>Overview</MenuItem>
                <hr style={{width: '80%', border: '0.5px solid #e0e0e0'}}/>
                <MenuItem viewId={2}>Fire Impact</MenuItem>
                <hr style={{width: '80%', border: '0.5px solid #e0e0e0'}}/>
                <MenuItem viewId={3}>Blabla</MenuItem>
                <hr style={{width: '80%', border: '0.5px solid #e0e0e0'}}/>
                <MenuItem viewId={4}>Blabla</MenuItem>
            </Card>
            <div style={{flexGrow: 1}}>
                <div
                    dangerouslySetInnerHTML={{__html: htmlContent}}
                    style={{
                        padding: '20px',
                        backgroundColor: '#fff', // Adjust the background color as needed
                        borderRadius: '20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                        margin: '20px', // Adds some margin around the card
                        maxWidth: 'calc(100% - 40px)', // Ensures padding is accounted for in full width
                        boxSizing: 'border-box', // Includes padding and borders in total width and height
                        height: '50vh', // Sets the height of the div to 50% of the viewport height
                        width: '100%', // Ensure the width takes up all available space within its parent
                        display: 'flex', // Makes the div a flex container
                        justifyContent: 'center', // Centers child content horizontally
                        alignItems: 'center', // Centers child content vertically
                        overflow: 'auto' // Adds scrollbars if the content overflows the fixed height
                    }}
                />
                <Slider
                    defaultValue={2010}
                    step={1}
                    min={2010}
                    max={2020}
                    marks={marks}
                    valueLabelDisplay="auto"
                    onChange={handleYearChange}
                />
                {view === 1 || view === 2 ? <View1 year={year}/> : <View2/>}
            </div>
        </div>
    );
}
export default App;