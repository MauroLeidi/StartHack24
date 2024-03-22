import React, { memo } from "react";

const memoMap = memo(function MyComponent({ year, layers }) {
  // A component that takes an 'item' prop and doesn't re-render unless item changes
  layers_year = layers.map((layer) => {
    if (layer === "landcover_" || layer === "burn_") return layer + year;
    else return layer;
  });
  return <BrazilMap year={year} layers={layers_year} />;
});

function memoMaps({ layers }) {
  // A component that generates a list of MyComponents based on the 'items' prop
  return (
    <div>
      {items.map((item, index) => (
        <MyComponent key={index} item={item} />
      ))}
    </div>
  );
}

export default memoMaps;
