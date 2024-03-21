import React from "react";
import { Card, CardMedia, Grid } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";

function view3({ year, htmlContent }) {
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

  // Modified to calculate CO2 loss by multiplying burned hectares by 25
  const getCO2Loss = () =>
    Object.values(landCoverBurnedAreaStats[year])
      .sort(
        (a, b) =>
          a.burned_hectars / a.total_land_cover_hectares -
          b.burned_hectars / b.total_land_cover_hectares
      )
      .map((lc_ba_stat) => lc_ba_stat.burned_hectars * 205); // CO2 loss calculation

  const getOption = () => {
    return {
      grid: {
        left: 50,
      },
      title: {
        text: "CO2 Lost by Land Burned Area",
      },
      tooltip: {},
      legend: {
        data: ["CO2 Lost by Burned Area"],
      },
      xAxis: {
        type: "value",
        axisLabel: {
          formatter: function (value) {
            return `${value} units`; // You can adjust the unit if you know what it represents more accurately
          },
        },
      },
      yAxis: {
        data: getLandCoverNames(),
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
      },
      series: [
        {
          name: "CO2 Loss",
          type: "bar",
          data: getCO2Loss(),
          barWidth: "50%",
        },
      ],
    };
  };

  // Component structure remains the same

  return (
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
  );
}

export default view3;
