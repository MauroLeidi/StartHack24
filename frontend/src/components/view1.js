import React, { memo, useState } from "react";
import { Card, Grid, Slider, Typography } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import BrazilMap from "./brazilMap";
import Gauge from "./gauge/gauge";

function View1() {
  // Initialize local state for the year
  const [year, setYear] = useState(2010);

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

  // Year Slider marks
  const marks = [];
  for (let y = 2010; y <= 2020; y++) {
    marks.push({ value: y, label: `${y}` });
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
                layers={["landcover_" + year, "burn_" + year]}
              />
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
          value={year}
          onChange={handleYearChange}
          defaultValue={2010}
          step={1}
          min={2010}
          max={2020}
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
