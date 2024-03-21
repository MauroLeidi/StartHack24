import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Grid, Card, Box, Button, ButtonGroup, Slider } from "@mui/material";
import View1 from "./components/view1";
import View2 from "./components/view2";

function App() {
  const [htmlContent, setHtmlContent] = useState("");
  const [view, setView] = useState(1);

  const marks = [];
  for (let year = 2002; year <= 2020; year++) {
    marks.push({ value: year, label: `${year}` });
  }

  useEffect(() => {
    // Define the function that fetches the HTML
    const fetchLandcoverHtml = async () => {
      // Your payload, adjust the years as needed
      const payload = {
        layers: ["biomes"], // Example years
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

  return (
    <div className="App">
      <Grid container sx={{ p: 2 }} spacing={2}>
        <Grid item xs={2}>
          <ButtonGroup
            orientation="vertical"
            aria-label="Vertical button group"
            variant="contained"
            style={{ height: "100%", width: "100%" }}
          >
            <Button onClick={() => setView(1)}>nav 1</Button>
            <Button onClick={() => setView(2)}>nav 2</Button>
            <Button onClick={() => setView(3)}>nav 3</Button>
            <Button onClick={() => setView(4)}>nav 4</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={7}>
          {/* Dangerously set inner HTML */}
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <Slider
            defaultValue={2010}
            step={1}
            min={2010}
            max={2020}
            marks={marks}
            valueLabelDisplay="auto"
          ></Slider>
        </Grid>
        <Grid item xs={3}>
          {view === 1 || view === 2 ? <View1 /> : <View2 />}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
