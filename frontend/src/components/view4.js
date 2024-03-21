import React from "react";
import { Card, Grid } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import BrazilMap from "./brazilMap";

function view4({ year, htmlContent }) {
  // Assuming "Urban and Built-up" is the exact name in your data
  const urbanData = Object.values(landCoverBurnedAreaStats[year]).find(
    (lc_ba_stat) => lc_ba_stat.name === "Urban and Built-up"
  );

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

      {/* BrazilMap and ReactEcharts display */}
      <Grid item container spacing={2} style={{ height: "50vh" }}>
        <Grid item xs={6} style={{ height: "100%" }}>
          <BrazilMap year={year} />
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
    </Grid>
  );
}

export default view4;
