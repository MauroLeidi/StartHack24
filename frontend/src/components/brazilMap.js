import React from "react";

const brazilMap = ({ htmlContent }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        padding: "20px",
        backgroundColor: "#fff", // Adjust the background color as needed
        borderRadius: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
        margin: "20px", // Adds some margin around the card
        maxWidth: "calc(100% - 40px)", // Ensures padding is accounted for in full width
        boxSizing: "border-box", // Includes padding and borders in total width and height
        height: "50vh", // Sets the height of the div to 50% of the viewport height
        width: "100%", // Ensure the width takes up all available space within its parent
        display: "flex", // Makes the div a flex container
        justifyContent: "center", // Centers child content horizontally
        alignItems: "center", // Centers child content vertically
        overflow: "auto", // Adds scrollbars if the content overflows the fixed height
      }}
    />
  );
};

export default brazilMap;
