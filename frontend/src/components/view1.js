import React, { useState } from "react";
import { Card, Grid, Slider } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import BrazilMap from "./brazilMap";

function View1() {
  // Initialize local state for the year
  const [year, setYear] = useState(2010);

  // Year Slider marks
  const marks = [];
  for (let year = 2010; year <= 2020; year++) {
    marks.push({ value: year, label: `${year}` });
  }

  // Handle year change for the slider
  const handleYearChange = (event, newValue) => {
    setYear(newValue);
  };

  return (
    <Grid container style={{ height: "80vh" }} padding={2} spacing={2}>
      {/* Row 1: Split into two columns */}
      <Grid item xs={12} style={{ height: "80%" }}>
        <Grid container spacing={2} style={{ height: "100%" }}>
          {/* Left Column: BrazilMap */}
          <Grid item xs={10}>
            <Card
              style={{ padding: "20px", borderRadius: "20px", height: "100%" }}
            >
              <BrazilMap
                year={year}
                layers={["landcover_" + year, "biomes", "burn_" + year]}
              />
            </Card>
          </Grid>

          {/* Right Column: Card containing fat metric */}
          <Grid item xs={2}>
            <Card
              style={{
                padding: "20px",
                borderRadius: "20px",
                height: "100%",
              }}
            >
              ks
            </Card>
          </Grid>
        </Grid>
      </Grid>
      {/* Row 2: for Year Selector Slider */}
      <Grid item xs={12} style={{ height: "15%" }}>
        <Card style={{ padding: "20px", borderRadius: "20px", height: "100%" }}>
          <Slider
            padding={2}
            value={year}
            onChange={handleYearChange}
            defaultValue={2010}
            step={1}
            min={2010}
            max={2020}
            marks={marks}
            valueLabelDisplay="auto"
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default View1;
