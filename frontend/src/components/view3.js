import React, { useState, useEffect } from "react";
import { Card, Grid, Slider, Box } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import co2emission from "../data/co2_emitted.json";
import BrazilMap from "./brazilMap";

function View3() {
  const [year, setYear] = useState(2010);
  const [maxCO2LandCoverName, setMaxCO2LandCoverName] = useState(
    "Evergreen Broadleaf Forest"
  );
  const [maxCO2, setMaxCO2] = useState(0);
  const CO2PerPlane = 1.7 * 2;
  const LANDCOVER_TYPE_TO_COLOR = {
    "Evergreen Needleleaf Forest": "#05450a",
    "Evergreen Broadleaf Forest": "#086a10",
    "Deciduous Needleleaf Forest": "#54a708",
    "Deciduous Broadleaf Forest": "#78d203",
    "Mixed Forest": "#009900",
    "Closed Shrublands": "#c6b044",
    "Open Shrublands": "#dcd159",
    "Woody Savannas": "#dade48",
    Savannas: "#fbff13",
    Grasslands: "#b6ff05",
    "Permanent Wetlands": "#27ff87",
    Croplands: "#c24f44",
    "Urban and Built-up": "#a5a5a5",
    "Cropland/Natural Vegetation Mosaic": "#ff6d4c",
    "Snow and Ice": "#69fff8",
    "Barren or Sparsely Vegetated": "#f9ffa4",
    Unclassified: "#1c0dff",
  };

  const findMaxCO2LandCoverName = () => {
    let maxCO2Loss = 0;
    let maxCO2LandCoverName = "";

    const landCoverStats = Object.values(landCoverBurnedAreaStats[year]);
    landCoverStats.forEach((lc_ba_stat) => {
      const co2Loss = lc_ba_stat.burned_hectars * co2emission[lc_ba_stat.name]; // Assuming this is how CO2 loss is calculated
      if (co2Loss > maxCO2Loss) {
        maxCO2Loss = co2Loss;
        maxCO2LandCoverName = lc_ba_stat.name;
      }
    });
    setMaxCO2LandCoverName(maxCO2LandCoverName);
    setMaxCO2(maxCO2Loss);
  };

  useEffect(() => {
    findMaxCO2LandCoverName();
  }, [year]);

  // Year Slider marks
  const marks = [];
  for (let year = 2010; year <= 2020; year++) {
    marks.push({ value: year, label: `${year}` });
  }

  // Handle year change for the slider
  const handleYearChange = (event, newValue) => {
    setYear(newValue);
  };

  const setMaxCO2LandCover = (name) => {
    setMaxCO2LandCoverName(name);
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

  function getTotalCO2EmissionsOption(landCoverBurnedAreaStats, year) {
    // Sum all CO2 emissions
    const totalCO2Emissions = Object.values(
      landCoverBurnedAreaStats[year]
    ).reduce((sum, { burned_hectars }) => sum + burned_hectars * 50, 0); // Using the same factor as before, adjust if needed

    // Average CO2 emissions from a car per 100km: 12kg (120g CO2 per km)
    const averageCO2PerCarPer100km = 12;

    // Calculate equivalent number of cars driving 100km
    const equivalentCars = totalCO2Emissions / averageCO2PerCarPer100km;

    // ECharts bar plot option for total CO2 emissions
    return {
      title: {
        text: "Equivalent Number of Cars Driving 100km",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: ["CO2 as Cars "],
      },
      yAxis: {
        type: "value",
        name: "Equivalent Cars",
      },
      series: [
        {
          data: [equivalentCars.toFixed(0)],
          type: "bar",
        },
      ],
    };
  }

  function getCO2LossOption() {
    const landCoverNamesAndCO2Loss = Object.values(
      landCoverBurnedAreaStats[year]
    )
      .sort((a, b) => b.burned_hectars - a.burned_hectars)
      .map((lc_ba_stat) => ({
        name: wrapLabel(lc_ba_stat.name, 2),
        value: lc_ba_stat.burned_hectars * co2emission[lc_ba_stat.name],
        itemStyle: {
          color: LANDCOVER_TYPE_TO_COLOR[lc_ba_stat.name] || "#999", // Fallback color if not defined
        },
      }));

    return {
      title: {
        text: "CO2 Emissions by Burned Landcover Type",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "CO2 Emissions",
          type: "pie",
          radius: "150px",
          data: landCoverNamesAndCO2Loss,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            formatter: "{b}",
          },
        },
      ],
    };
  }

  const getPictorialCarChartOption = () => {
    const totalCars = Math.round(maxCO2 / 1000 / CO2PerPlane);
    const carSymbol =
      "path://M1.112,32.559l2.998,1.205l-2.882,2.268l-2.215-0.012L1.112,32.559z M37.803,23.96 c0.158-0.838,0.5-1.509,0.961-1.904c-0.096-0.037-0.205-0.071-0.344-0.071c-0.777-0.005-2.068-0.009-3.047-0.009 c-0.633,0-1.217,0.066-1.754,0.18l2.199,1.804H37.803z M39.738,23.036c-0.111,0-0.377,0.325-0.537,0.924h1.076 C40.115,23.361,39.854,23.036,39.738,23.036z M39.934,39.867c-0.166,0-0.674,0.705-0.674,1.986s0.506,1.986,0.674,1.986 s0.672-0.705,0.672-1.986S40.102,39.867,39.934,39.867z M38.963,38.889c-0.098-0.038-0.209-0.07-0.348-0.073 c-0.082,0-0.174,0-0.268-0.001l-7.127,4.671c0.879,0.821,2.42,1.417,4.348,1.417c0.979,0,2.27-0.006,3.047-0.01 c0.139,0,0.25-0.034,0.348-0.072c-0.646-0.555-1.07-1.643-1.07-2.967C37.891,40.529,38.316,39.441,38.963,38.889z M32.713,23.96 l-12.37-10.116l-4.693-0.004c0,0,4,8.222,4.827,10.121H32.713z M59.311,32.374c-0.248,2.104-5.305,3.172-8.018,3.172H39.629 l-25.325,16.61L9.607,52.16c0,0,6.687-8.479,7.95-10.207c1.17-1.6,3.019-3.699,3.027-6.407h-2.138 c-5.839,0-13.816-3.789-18.472-5.583c-2.818-1.085-2.396-4.04-0.031-4.04h0.039l-3.299-11.371h3.617c0,0,4.352,5.696,5.846,7.5 c2,2.416,4.503,3.678,8.228,3.87h30.727c2.17,0,4.311,0.417,6.252,1.046c3.49,1.175,5.863,2.7,7.199,4.027 C59.145,31.584,59.352,32.025,59.311,32.374z M22.069,30.408c0-0.815-0.661-1.475-1.469-1.475c-0.812,0-1.471,0.66-1.471,1.475 s0.658,1.475,1.471,1.475C21.408,31.883,22.069,31.224,22.069,30.408z M27.06,30.408c0-0.815-0.656-1.478-1.466-1.478 c-0.812,0-1.471,0.662-1.471,1.478s0.658,1.477,1.471,1.477C26.404,31.885,27.06,31.224,27.06,30.408z M32.055,30.408 c0-0.815-0.66-1.475-1.469-1.475c-0.808,0-1.466,0.66-1.466,1.475s0.658,1.475,1.466,1.475 C31.398,31.883,32.055,31.224,32.055,30.408z M37.049,30.408c0-0.815-0.658-1.478-1.467-1.478c-0.812,0-1.469,0.662-1.469,1.478 s0.656,1.477,1.469,1.477C36.389,31.885,37.049,31.224,37.049,30.408z M42.039,30.408c0-0.815-0.656-1.478-1.465-1.478 c-0.811,0-1.469,0.662-1.469,1.478s0.658,1.477,1.469,1.477C41.383,31.885,42.039,31.224,42.039,30.408z M55.479,30.565 c-0.701-0.436-1.568-0.896-2.627-1.347c-0.613,0.289-1.551,0.476-2.73,0.476c-1.527,0-1.639,2.263,0.164,2.316 C52.389,32.074,54.627,31.373,55.479,30.565z"; // Replace with your car SVG path

    return {
      title: {
        text: "Equivalent Number of Flights London <> New York",
        left: "center",
        textStyle: {
          fontSize: 20,
        },
      },
      grid: {
        containLabel: true,
        left: 20,
        right: 20,
      },
      yAxis: {
        type: "category",
        data: [maxCO2LandCoverName],
        inverse: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          margin: 30,
          fontSize: 14,
          show: false,
        },
      },
      xAxis: {
        type: "value",
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [
        {
          name: "CO2 Emissions",
          type: "pictorialBar",
          barWidth: "40%",
          label: {
            show: true,
            position: "right", // Changed position to 'left'
            offset: [10, 0], // Adjusted offset for the left position
            formatter: function (params) {
              // Use Intl.NumberFormat to format the number with a dot as the thousands separator
              return new Intl.NumberFormat("de-DE").format(params.value);
            },
            fontSize: 25, // Increased font size
          },
          symbol: carSymbol,
          symbolRepeat: "fixed",
          //symbolRepeat: true,
          symbolBoundingData: totalCars,
          symbolMargin: "5%",
          symbolClip: true,
          symbolSize: [50, 30],
          //symbolBoundingData: totalCars,
          data: [
            {
              value: totalCars,
            },
          ],
        },
      ],
    };
  };

  function getBurnedVsNonBurnedOption() {
    const totalBurned = Object.values(landCoverBurnedAreaStats[year]).reduce(
      (sum, { burned_hectars }) => sum + burned_hectars,
      0
    );
    const totalArea = Object.values(landCoverBurnedAreaStats[year]).reduce(
      (sum, { total_land_cover_hectares }) => sum + total_land_cover_hectares,
      0
    );
    const totalNonBurned = totalArea - totalBurned;

    return {
      title: {
        text: "Burned vs. Non-Burned Area",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "Area",
          type: "pie",
          radius: "100px",
          data: [
            { name: "Burned Area", value: totalBurned },
            { name: "Non-Burned Area", value: totalNonBurned },
          ],
          label: {
            show: true,
            formatter: "{b}\n{d}%",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }

  return (
    <Grid
      container
      style={{ height: "80vh", width: "100%", justifyContent: "space-evenly" }}
      spacing={2}
    >
      {/* Top Row for Maps and CO2 Loss Chart */}
      <Grid item xs={12} style={{ height: "65%" }}>
        <Grid container style={{ height: "100%" }} spacing={3}>
          {/* Top Left Card for Map */}
          <Grid item xs={6}>
            <Card
              style={{
                height: "100%",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0 0 0 0",
              }}
            >
              <BrazilMap
                layers={[
                  "landcover_only_" + maxCO2LandCoverName + "_" + year,
                  "burning_" + year,
                ]}
                key={`brazil-map-${year}-${maxCO2LandCoverName}`}
              />
            </Card>
          </Grid>
          {/* Top Right Card for CO2 Loss Chart */}
          <Grid item xs={6}>
            <Card
              style={{
                height: "100%",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0 0 0 0",
              }}
            >
              <ReactEcharts
                option={getCO2LossOption()}
                style={{ height: "100%", width: "100%" }}
              />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        style={{ height: "25%", width: "100%", marginTop: "90px" }}
      >
        <Card
          style={{
            height: "100%",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 0 0",
          }}
        >
          <Box width="100%" maxWidth={1000}>
            {" "}
            {/* Adjust maxWidth as needed */}
            <ReactEcharts
              option={getPictorialCarChartOption()}
              style={{ height: "100%", width: "100%" }} // Ensures the chart is responsive within the Box container
            />
          </Box>
        </Card>
      </Grid>

      {/* Slider Grid Item */}
      <Grid item xs={12} style={{ height: "10%", paddingTop: "0px" }}>
        {" "}
        {/* Adjust the height and margin as needed */}
        <Card
          style={{
            height: "100%",
            backgroundColor: "#fff",
            paddingTop: "0px",
            paddingBottom: "0px",
            borderRadius: "5px",
            boxShadow: "0 0 0 0",
          }}
        >
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

export default View3;
