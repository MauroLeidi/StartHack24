import React, { useEffect, useState } from "react";
import logo from "./logo.svg"; // Make sure your logo is correctly imported
import "./App.css";
import { Card, Box, Slider } from "@mui/material";
import View1 from "./components/view1";
import View2 from "./components/view2";
import View3 from "./components/view3";
import View4 from "./components/view4";

function App() {
  const [htmlContent, setHtmlContent] = useState("");
  const [view, setView] = useState(1);
  const [year, setYear] = useState(2010);

  useEffect(() => {
    // Define the function that fetches the HTML
    const fetchLandcoverHtml = async () => {
      // Your payload, adjust the years as needed
      const payload = {
        layers: ["biomes", "landcover_" + year, "burn_" + year],
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
          console.log(html);
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
  }, [year]); // Empty dependency array means this effect runs only once after the initial render

  const MenuItem = ({ viewId, children }) => (
    <div
      onClick={() => setView(viewId)}
      style={{
        width: "90%",
        cursor: "pointer",
        padding: "10px 0",
        margin: "10px auto",
        backgroundColor: view === viewId ? "#f0f0f0" : "transparent",
        textAlign: "center",
        borderRadius: "5px",
        transition: "background-color 0.3s",
      }}
    >
      {children}
    </div>
  );

  return (
    <div
      className="App"
      style={{
        display: "flex",
        minHeight: "100vh",
        boxSizing: "border-box",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
      }}
    >
      {/* Navigation Card on the Left */}
      <Card
        elevation={3}
        style={{
          width: "250px",
          marginRight: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "20px",
        }}
      >
        {/* Logo Placeholder */}
        <Box
          sx={{
            width: "100%",
            height: 120,
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            marginBottom: "20px",
          }}
        />

        {/* Menu Items */}
        <MenuItem viewId={1}>Overview</MenuItem>
        <hr style={{ width: "80%", border: "0.5px solid #e0e0e0" }} />
        <MenuItem viewId={2}>Fire Impact</MenuItem>
        <hr style={{ width: "80%", border: "0.5px solid #e0e0e0" }} />
        <MenuItem viewId={3}>Blabla</MenuItem>
        <hr style={{ width: "80%", border: "0.5px solid #e0e0e0" }} />
        <MenuItem viewId={4}>Infrastructural analysis</MenuItem>
      </Card>
      {/* Dynamic View Content */}
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {view === 1 ? (
          <View1 />
        ) : view === 2 ? (
          <View2 />
        ) : view === 3 ? (
          <View3 />
        ) : view == 4 ? (
          <View4 />
        ) : null}
      </div>
    </div>
  );
}
export default App;
