import React from "react";
import chart1 from "../assets/chart1.jpeg";
import chart2 from "../assets/chart2.png";
import chart3 from "../assets/chart3.png";
import chart4 from "../assets/chart4.jpeg";
import { Card, CardMedia, Grid } from "@mui/material";
import ReactEcharts from "echarts-for-react";

function view1() {
  const getOption = () => {
    return {
      grid: {
        // Added grid property
        left: 50, // provides 100 pixels of space from the bottom.
      },
      title: {
        text: "ECharts in React",
      },
      tooltip: {},
      legend: {
        data: ["Sales"],
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        data: ["shirt", "cardign", "chiffon shirt", "pants", "heels", "socks"],
      },
      series: [
        {
          name: "Sales",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
          barWidth: "20%",
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
