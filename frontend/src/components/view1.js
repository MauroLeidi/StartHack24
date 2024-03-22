import React, { useState, useEffect } from "react";
import { Card, Grid, Slider, Typography } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import BrazilMapStatic from "./brazilMapStatic";
import Gauge from "./gauge/gauge";
import ClipLoader from "react-spinners/ClipLoader";

function View1() {
  // Initialize local state for the year
  const [year, setYear] = useState(2010);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [brazilMaps, setBrazilMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLandcoverHtml = async (layers) => {

  const payload = {
    layers: layers, // Use the layers argument to construct the payload
  };

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
      return html;
    } else {
      console.error("Failed to fetch HTML");
    }
  } catch (error) {
    console.error("Error fetching HTML:", error);
  }
};

  useEffect(() => {
  const loadMaps = async () => {
    const maps = [];
    for (let y = 2010; y <= 2020; y++) {
      let layers = ["landcover_" + y, "burn_" + y]; // Notice the change to `y` for the burn layer
      try {
        const htmlContent = await fetchLandcoverHtml(layers);
        if (htmlContent) {
          maps.push(
            <BrazilMapStatic
              key={y} // Adding a key for React list rendering best practices
              htmlcontent={htmlContent}
            />
          );
        } else {
          // Handle the case where htmlContent is null or undefined
          console.error(`Failed to fetch content for year ${y}`);
        }
      } catch (error) {
        console.error(`Error fetching content for year ${y}:`, error);
      }
    }
    console.log(maps);
    setBrazilMaps(maps);
    setIsLoading(false); // Only set loading to false after all maps are loaded
  };

  loadMaps(); // Call the async function to load maps
}, []); // Empty dependency array to only run once on component mount


  const handleSliderChange = (event, newIndex) => {
    setSliderIndex(newIndex);
  };

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toFixed(1).replace(/\.0$/, "");
  }

  const getTotalLandCover = (yr) =>
    Object.values(landCoverBurnedAreaStats[yr]).reduce(
      (acc, lcba) => acc + lcba.total_land_cover_hectares,
      0
    );
  const getTotalDegradation = () => {
    const originalTotalLandCover = getTotalLandCover(2010);
    const yearTotalLandCover = getTotalLandCover(year);
    return (
      (100 * (originalTotalLandCover - yearTotalLandCover)) /
      originalTotalLandCover
    );
  };

  const getTotalDeforestation = () => {
    const originalTotalLandCover =
      landCoverBurnedAreaStats[2010]["5"].total_land_cover_hectares + //mixed forest
      landCoverBurnedAreaStats[2010]["1"].total_land_cover_hectares + //Evergreen Needleleaf Forest
      landCoverBurnedAreaStats[2010]["2"].total_land_cover_hectares + //Evergreen Broadleaf Forest
      landCoverBurnedAreaStats[2010]["4"].total_land_cover_hectares; //Deciduous Broadleaf Forest
    const yearTotalLandCover =
      landCoverBurnedAreaStats[year]["5"].total_land_cover_hectares + //mixed forest
      landCoverBurnedAreaStats[year]["1"].total_land_cover_hectares + //Evergreen Needleleaf Forest
      landCoverBurnedAreaStats[year]["2"].total_land_cover_hectares + //Evergreen Broadleaf Forest
      landCoverBurnedAreaStats[year]["4"].total_land_cover_hectares; //Deciduous Broadleaf Forest
    return (
      (100 * (originalTotalLandCover - yearTotalLandCover)) /
      originalTotalLandCover
    );
  };

  const getTotalBurnedArea = () =>
    Object.values(landCoverBurnedAreaStats[year]).reduce(
      (acc, lcba) => acc + lcba.burned_hectars,
      0
    );

  const marks = brazilMaps.map((_, index) => ({
    value: index,
    label: `${2010 + index}`,
  }));

  return (
    <Grid container style={{ height: "80vh" }} padding={2} spacing={2}>
      {/* Row 1: Split into two columns */}
      <Grid item xs={12} style={{ height: "80%" }}>
        <Grid container spacing={2} style={{ height: "100%" }}>
          {/*  */}
          <Grid item xs={10}>
            <Card
              style={{ padding: "20px", borderRadius: "20px", height: "100%" }}
            >
              {isLoading ? (
               <ClipLoader color="#007bff" size={150} /> // Use the ClipLoader spinner
          ) : (
                  brazilMaps[sliderIndex]
          )}
            </Card>
          </Grid>

          {/* Right Column: Card containing fat metric */}
          <Grid item xs={2}>
            <Card
              style={{
                padding: "10px",
                borderRadius: "20px",
                height: "100%",
              }}
            >
              <Typography>
                Total Deforestation <br />
                {formatNumber(getTotalDeforestation())}%
              </Typography>
              <Typography>
                Total Year Burn <br />
                {formatNumber(getTotalBurnedArea())} <br /> ha{" "}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      {/* Row 2: for Year Selector Slider */}
      <Grid item xs={12} style={{ height: "15%" }}>
         <Card style={{ height: '100%', backgroundColor: '#fff', paddingTop: "20px", paddingBottom: "0px", borderRadius: "20px", boxShadow: "0 0 0 0"  }}>
         <Slider
            value={sliderIndex}
            onChange={handleSliderChange}
            step={1}
            min={0}
            max={marks.length - 1}
            valueLabelDisplay="off"
            marks={marks}
            style={{ width: "90%" }}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default View1;
