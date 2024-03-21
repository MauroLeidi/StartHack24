import React, { useState } from "react";
import { Card, Grid, Slider } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import BrazilMap from "./brazilMap";

function View2() {
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

  const wrapLabel = (label, n) => {
    var words = label.split(" ");
    var wrappedText = words.reduce((result, word, i) => {
      return i % n === 0 ? result + "\n" + word : result + " " + word;
    }, "");
    return wrappedText.trim();
  };

  const getLandCoverNames = () =>
    Object.values(landCoverBurnedAreaStats[year])
      .sort(
        (a, b) =>
          a.burned_hectars / a.total_land_cover_hectares -
          b.burned_hectars / b.total_land_cover_hectares
      )
      .map((lc_ba_stat) => wrapLabel(lc_ba_stat.name, 2));

  const getBurnedHectars = () =>
    Object.values(landCoverBurnedAreaStats[year])
      .sort(
        (a, b) =>
          a.burned_hectars / a.total_land_cover_hectares -
          b.burned_hectars / b.total_land_cover_hectares
      )
      .map((lc_ba_stat) => lc_ba_stat.burned_hectars);

  const getBurnedPercentage = () =>
    Object.values(landCoverBurnedAreaStats[year])
      .sort(
        (a, b) =>
          a.burned_hectars / a.total_land_cover_hectares -
          b.burned_hectars / b.total_land_cover_hectares
      )
      .map(
        (lc_ba_stat) =>
          (lc_ba_stat.burned_hectars / lc_ba_stat.total_land_cover_hectares) *
          100
      );

  const getOption = () => {
  return {
    grid: {
      left: '0%',
      right: '5%',
      bottom: '0%',
      top: '7%',
      containLabel: true,
    },
    title: {
      text: "Burned Area by Landcover Type",
      left: 'center',  // Centers the title
    },
    tooltip: {},
    legend: {
      data: ["Burned Area % by Land Cover"],
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: function (value) {
          return value + "%";  // Append '%'
        },
      },
    },
    yAxis: {
      data: getLandCoverNames(),
      axisLabel: {
        rotate: 0,
        fontSize: 15,
      },
    },
    series: [
      {
        name: "%",
        type: "bar",
        data: getBurnedPercentage(),
        barWidth: "60%",  // Increased bar width for thicker bars
      },
    ],
  };
};

    return (
    <Grid container style={{ width:"99.5%", height: '80vh', justifyContent: "space-evenly"}} spacing={2}>
      {/* Top Row */}
      <Grid item xs={12} style={{ height: '80%' }}>
        <Grid container style={{ height: '100%' }} spacing={3}>
          {/* Top Left Card */}
          <Grid item xs={6}>
            <Card style={{ height: '100%', backgroundColor: '#fff', padding: "20px", borderRadius: "20px", boxShadow: "0 0 0 0"  }}>
          {/* Bottom Cell Content */}
          <BrazilMap layers={["biomes", "landcover_" + year, "burning_" + year]} />
            </Card>
          </Grid>
          <Grid item xs={6}>
           <Card style={{ height: '100%', backgroundColor: '#fff', padding: "20px", borderRadius: "20px", boxShadow: "0 0 0 0" }}>
          <ReactEcharts
            option={getOption()}
            style={{ height: "100%", width: "100%" }}
          />
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ height: '10%', marginTop: "40px"}}>
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

export default View2;
