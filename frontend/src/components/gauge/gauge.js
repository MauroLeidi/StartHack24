import EChartsReact from "echarts-for-react";
import React from "react";

const gauge = ({ perc }) => {
  var app = {};
  var ROOT_PATH = "https://echarts.apache.org/examples";
  var option;

  var _panelImageURL = ROOT_PATH + "/data/asset/img/custom-gauge-panel.png";
  var _valOnRadianMax = 80;
  var _outerRadius = 90;
  var _innerRadius = 50;
  var _pointerInnerRadius = 40;
  var _insidePanelRadius = 50;
  function renderItem(params, api) {
    var valOnRadian = api.value(1);
    var coords = api.coord([api.value(0), valOnRadian]);
    var polarEndRadian = coords[3];
    var imageStyle = {
      image: _panelImageURL,
      x: params.coordSys.cx - _outerRadius,
      y: params.coordSys.cy - _outerRadius,
      width: _outerRadius * 2,
      height: _outerRadius * 2,
    };
    return {
      type: "group",
      children: [
        {
          type: "image",
          style: imageStyle,
          clipPath: {
            type: "sector",
            shape: {
              cx: params.coordSys.cx,
              cy: params.coordSys.cy,
              r: _outerRadius,
              r0: _innerRadius,
              startAngle: 0,
              endAngle: -polarEndRadian,
              transition: "endAngle",
              enterFrom: { endAngle: 0 },
            },
          },
        },
        {
          type: "image",
          style: imageStyle,
          clipPath: {
            type: "polygon",
            shape: {
              points: makePionterPoints(params, polarEndRadian),
            },
            extra: {
              polarEndRadian: polarEndRadian,
              transition: "polarEndRadian",
              enterFrom: { polarEndRadian: 0 },
            },
            during: function (apiDuring) {
              apiDuring.setShape(
                "points",
                makePionterPoints(params, apiDuring.getExtra("polarEndRadian"))
              );
            },
          },
        },
        {
          type: "circle",
          shape: {
            cx: params.coordSys.cx,
            cy: params.coordSys.cy,
            r: _insidePanelRadius,
          },
          style: {
            fill: "#fff",
            shadowBlur: 25,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(76,107,167,0.4)",
          },
        },
        {
          type: "text",
          extra: {
            valOnRadian: valOnRadian,
            transition: "valOnRadian",
            enterFrom: { valOnRadian: 0 },
          },
          style: {
            text: makeText(valOnRadian),
            fontSize: 40,
            fontWeight: 600,
            x: params.coordSys.cx,
            y: params.coordSys.cy,
            fill: "rgb(0,50,190)",
            align: "center",
            verticalAlign: "middle",
            enterFrom: { opacity: 0 },
          },
          during: function (apiDuring) {
            apiDuring.setStyle(
              "text",
              makeText(apiDuring.getExtra("valOnRadian"))
            );
          },
        },
      ],
    };
  }
  function convertToPolarPoint(renderItemParams, radius, radian) {
    return [
      Math.cos(radian) * radius + renderItemParams.coordSys.cx,
      -Math.sin(radian) * radius + renderItemParams.coordSys.cy,
    ];
  }
  function makePionterPoints(renderItemParams, polarEndRadian) {
    return [
      convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
      convertToPolarPoint(
        renderItemParams,
        _outerRadius,
        polarEndRadian + Math.PI * 0.03
      ),
      convertToPolarPoint(
        renderItemParams,
        _pointerInnerRadius,
        polarEndRadian
      ),
    ];
  }
  function makeText(valOnRadian) {
    // Validate additive animation calc.
    if (valOnRadian < -10) {
      alert("illegal during val: " + valOnRadian);
    }
    return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + "%";
  }
  option = {
    animation: false,
    dataset: {
      source: [[1, _valOnRadianMax * (perc / 100)]],
    },
    tooltip: {},
    angleAxis: {
      type: "value",
      startAngle: 0,
      show: false,
      min: 0,
      max: _valOnRadianMax,
    },
    radiusAxis: {
      type: "value",
      show: false,
    },
    polar: {},
    series: [
      {
        type: "custom",
        coordinateSystem: "polar",
        renderItem: renderItem,
      },
    ],
  };

  return <EChartsReact option={option}></EChartsReact>;
};

export default gauge;
