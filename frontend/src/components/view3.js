import React, { useState } from "react";
import { Card, Grid, Slider } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import landCoverBurnedAreaStats from "../data/land_cover_burned_area_stats.json";
import co2emission from "../data/co2_emitted.json";

function View3() {
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
  // Modified to calculate CO2 loss by multiplying burned hectares by 25
  const getCO2Loss = () =>
    Object.values(landCoverBurnedAreaStats[year])
      .sort((a, b) => a.burned_hectars - b.burned_hectars)
      .map(
        (lc_ba_stat) =>
          lc_ba_stat.burned_hectars * co2emission["lc_ba_stat.name"]
      ); // CO2 loss calculation

  function getCO2LossOption() {
    const landCoverNamesAndCO2Loss = Object.values(
      landCoverBurnedAreaStats[year]
    )
      .sort((a, b) => b.burned_hectars - a.burned_hectars)
      .map((lc_ba_stat) => ({
        name: wrapLabel(lc_ba_stat.name, 2),
        value: lc_ba_stat.burned_hectars * co2emission[lc_ba_stat.name], // Assuming 205 is the CO2 loss per hectare
      }));

    return {
      title: {
        text: "CO2 Loss by Land Cover Burned Area",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },

      series: [
        {
          name: "CO2 Loss",
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

  // Function to calculate the options for the Burned vs. Non-Burned Area chart
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

  // Assuming getCO2LossOption() is the function you use to generate the options
  // for the CO2 Loss by Land Cover Type pie chart, similar to the previous response.

  // Component render part
  return (
    <Grid
      container
      spacing={2}
      style={{ height: "100%", width: "100%", marginTop: "20px" }}
    >
      {/* Slider Grid Item */}
      <Grid item xs={12} style={{ padding: "20px" }}>
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

      {/* Burned vs Non-Burned Area Chart */}
      <Grid item xs={6}>
        <Card
          style={{
            height: "100%",
            display: "flex",
            padding: "20px",
            paddingTop: "30px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "20px",
          }}
        >
          <ReactEcharts
            option={getBurnedVsNonBurnedOption()}
            style={{ height: "100%", width: "100%" }}
            className="react_for_echarts"
          />
        </Card>
      </Grid>

      {/* CO2 Loss Chart */}
      <Grid item xs={6}>
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
            option={getCO2LossOption()} // Ensure this function is defined to generate the CO2 loss chart options
            style={{ height: "100%", width: "100%" }}
            className="react_for_echarts"
          />
        </Card>
      </Grid>
      {/* Total CO2 Emissions Chart */}
      <Grid item xs={12}>
        <Card
          elevation={3}
          style={{
            display: "flex",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "20px",
            height: "100%",
          }}
        >
          <ReactEcharts
            option={getTotalCO2EmissionsOption(landCoverBurnedAreaStats, year)}
            style={{ height: "400px", width: "100%" }}
            className="react_for_echarts"
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default View3;
