import React, { useState } from "react";
import { Card, Grid, Slider } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import populationData from "../data/yearly_affected_population.json";

import BrazilMap from "./brazilMap";

function View4() {
  const [year, setYear] = useState(2010);
  const maxCO2LandCoverName = ""
  // Year Slider marks
  const marks = [];
  for (let year = 2010; year <= 2020; year++) {
    marks.push({ value: year, label: `${year}` });
  }

  // Handle year change for the slider
  const handleYearChange = (event, newValue) => {
    setYear(newValue);
  };
  // Assuming "Urban and Built-up" is the exact name in your data
  const urbanData = Object.values(landCoverBurnedAreaStats[year]).find(
    (lc_ba_stat) => lc_ba_stat.name === "Urban and Built-up"
  );

  const population = populationData[year];

  const getOption = () => {
    return {
      grid: {
        left: "5%", // Increase the left padding to give more space for the axis labels
        right: "5%",
        containLabel: true,
      },
      title: {
        text: "Burned Area in Urban and Built-up",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          let data = params[0];
          return `${data.value.toFixed(0)} hectares burned`;
        },
      },
      xAxis: {
        type: "category",
        data: ["Urban and Built-up"],
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value} ha",
        },
      },
      series: [
        {
          name: "Hectares Burned",
          type: "bar",
          data: [urbanData?.burned_hectars || 0], // Safely accessing the burned hectares
          barWidth: "50%",
        },
      ],
    };
  };
  const getOptionPopulation = () => {
    return {
      grid: {
        left: "5%", // Increase the left padding to give more space for the axis labels
        right: "5%",
        containLabel: true,
      },
      title: {
        text: "Affected Population by Burned Area",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          let data = params[0];
          return `${data.value.toFixed(0)} people affected`;
        },
      },
      xAxis: {
        type: "category",
        data: ["Urban and Built-up"],
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value} pp.",
        },
      },
      series: [
        {
          name: "Hectares Burned",
          type: "bar",
          data: [population || 0], // Safely accessing the burned hectares
          barWidth: "50%",
        },
      ],
    };
  };

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      style={{ height: "calc(100vh - [HeaderHeight]px)" }}
    >
      {/* Placeholder component */}
      <Grid
        item
        style={{
          height: "20vh",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "20px",
        }}
      >
        <h2>Placeholder</h2>
      </Grid>
      <Grid item style={{ padding: "20px" }}>
        <Card
          elevation={3}
          style={{
            paddingLeft: "30px",
            paddingRight: "30px",
            paddingTop: "20px",
            paddingBottom: "20px",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Slider
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

      {/* BrazilMap and ReactEcharts display */}
      <Grid item container spacing={2} style={{ height: "50vh" }}>
        <Grid item xs={6} style={{ height: "100%" }}>
          <BrazilMap year={year} layers={["urban_" + year, "burn_" + year]} />
        </Grid>
        <Grid item xs={6} style={{ height: "100%" }}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              margin: "20px",
            }}
          >
            <ReactEcharts
              option={getOption()}
              style={{ height: "100%", width: "100%" }}
              className="react_for_echarts"
            />
          </Card>
        </Grid>
      </Grid>
      <Grid
        item
        style={{
          height: "20vh",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "20px",
        }}
      >
        <Card
          style={{
            height: "100%",
            display: "flex",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "20px",
          }}
        >
          <ReactEcharts
            option={getOptionPopulation()}
            style={{ height: "100%", width: "100%" }}
            className="react_for_echarts"
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default View4;
