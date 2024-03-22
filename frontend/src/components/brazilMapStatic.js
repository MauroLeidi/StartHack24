import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const BrazilMapStatic = ({ htmlcontent }) => {
    const [htmlContent, setHtmlContent] = useState(htmlcontent);

  return (
  <div
    style={{
      position: "relative",
      width: "100%", // Ensure this fills its parent
      height: "100%", // Ensure this fills its parent
      backgroundColor: "#fff",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden", // Add this to hide overflow
    }}
  ><div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
            maxHeight: "50vh",
        }}
      />
  </div>
)

};

export default BrazilMapStatic;
