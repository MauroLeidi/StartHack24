import React, { useEffect, useState } from "react";
import logo from "./assets/logo.png"; // Make sure your logo is correctly imported
import "./App.css";
import { Card, Box, Slider } from "@mui/material";
import View1 from "./components/view1";
import View2 from "./components/view2";
import View3 from "./components/view3";
import View4 from "./components/view4";

function App() {
  const [htmlContent, setHtmlContent] = useState("");
  const [view, setView] = useState(1);

  const MenuItem = ({ viewId, children }) => (
    <div
      onClick={() => setView(viewId)}
      style={{
        width: "90%",
        cursor: "pointer",
        padding: "10px 10px 10px 30px ",
        margin: "10px auto",
        backgroundColor: view === viewId ? "#f0f0f0" : "transparent",
        textAlign: "left",
        borderRadius: "5px",
        transition: "background-color 0.3s",
      }}
    >
      {children}
    </div>
  );

  return (
    <div
      className="App"
      style={{
        display: "flex",
        minHeight: "100vh",
        boxSizing: "border-box",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      {/* Navigation Card on the Left */}
      <Card
        elevation={3}
        style={{
          width: "250px",
          minWidth: "250px",
          marginRight: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "5px",
        }}
      >
        {/* Logo Placeholder */}
        <Box
          sx={{
            width: "100%",
            height: 150,
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            marginBottom: "20px",
          }}
        />

        {/* Dashboards Heading */}
        <div
          style={{
            width: "90%",
            padding: "10px 0 0 10px",
            margin: "10px auto",
            textAlign: "left",
            fontWeight: "bold",
            fontSize: "22px",
          }}
        >
          Dashboards
        </div>

        {/* Menu Items as Sub-Entries */}
        <MenuItem viewId={1}>Overview</MenuItem>
        <MenuItem viewId={2}>Impact per Landcover</MenuItem>
        <MenuItem viewId={3}>CO2 Emissions</MenuItem>
        <MenuItem viewId={4}>Impact on Society</MenuItem>
        <MenuItem viewId={5}>Future Overview</MenuItem>
      </Card>
      {/* Dynamic View Content */}
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {view === 1 ? (
          <View1 />
        ) : view === 2 ? (
          <View2 />
        ) : view === 3 ? (
          <View3 />
        ) : view == 4 ? (
          <View4 />
        ) : view == 5 ? (
          <View5 />
        ) : (
          <div>View not found</div>
        )}
      </div>
    </div>
  );
}
export default App;
