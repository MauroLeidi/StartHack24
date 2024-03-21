import React from "react";
import chart1 from "../assets/chart1.jpeg";
import chart2 from "../assets/chart2.png";
import chart3 from "../assets/chart3.png";
import chart4 from "../assets/chart4.jpeg";
import { Card, CardMedia, Grid } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";

function view1({ year }) {
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
        // Added grid property
        left: 80, // provides 100 pixels of space from the bottom.
      },
      title: {
        text: "Burned Area % by Land Cover",
      },
      tooltip: {},
      legend: {
        data: ["Burned Area % by Land Cover"],
      },
      xAxis: {
        type: "value",
        axisLabel: {
          formatter: function (value) {
            return value + "%"; // append '%'
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
          name: "%",
          type: "bar",
          data: getBurnedPercentage(),
          barWidth: "50%",
        },
      ],
    };
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <ReactEcharts
          option={getOption()}
          style={{ height: "350px", width: "100%" }}
          className="react_for_echarts"
        />
      </Grid>
      <Grid item>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={chart2}
            title="chart 2"
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default view1;
