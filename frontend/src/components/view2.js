import React from "react";
import chart1 from "../assets/chart1.jpeg";
import chart2 from "../assets/chart2.png";
import chart3 from "../assets/chart3.png";
import chart4 from "../assets/chart4.jpeg";
import { Card, CardMedia, Grid } from "@mui/material";

function view2() {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={chart3}
            title="chart 3"
          />
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={chart4}
            title="chart 4"
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default view2;
