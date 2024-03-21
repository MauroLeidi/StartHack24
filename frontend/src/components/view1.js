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

  const getTotalBurntAreaData = () => {
    // get total burnt area for each year
    const totalBurntAreaData = {};
    for (let year = 2010; year <= 2020; year++) {
      totalBurntAreaData[year] = Object.values(landCoverBurnedAreaStats[year]).reduce(
        (acc, lc_ba_stat) => acc + lc_ba_stat.burned_hectars,
        0
      );
    }
    return totalBurntAreaData;
  };

  const getLineChartOption = () => {
    const totalBurntAreaData = getTotalBurntAreaData();
    return {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Object.keys(totalBurntAreaData),
        show: false // Hides the x-axis
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false
        },
      },
      series: [{
        data: Object.values(totalBurntAreaData),
        type: 'line'
      }],
      grid: {
        // Adjust the grid settings to ensure the chart matches the width of the year picker
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };
  };

  const getOption = () => {
    return {
      grid: {
        // Added grid property
        left: 50, // provides 100 pixels of space from the bottom.
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
    <Grid container direction="column" spacing={2} style={{ height: "calc(100vh - [HeaderHeight]px)" }}>
      <Grid item style={{ padding: "20px" }}>
        <Card elevation={3} style={{
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingTop: "0px",
          paddingBottom: "0px",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
        }}>
          <ReactEcharts
            option={getLineChartOption()}
            style={{ height: "20vh", width: "100%" }}
          />
        </Card>
      </Grid>

      {/* New Row for Year Selector Slider - Moved up */}
      <Grid item style={{ padding: "20px" }}>
        <Card elevation={3} style={{
          paddingLeft: "30px",
          paddingRight: "30px",
          paddingTop: "20px",
          paddingBottom: "20px",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
        }}>
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

      {/* Row 3: Split into two columns */}
      <Grid item container spacing={2} style={{ height: "50vh" }}>
        {/* Left Column: BrazilMap */}
        <Grid item xs={6} style={{ height: "100%" }}>
          <BrazilMap year={year} />
        </Grid>

        {/* Right Column: Card containing ReactEcharts */}
        <Grid item xs={6} style={{ height: "100%" }}>
          <Card style={{
            height: "100%",
            display: "flex",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "20px"
          }}>
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

export default View1;

