
import React from "react";
import { CurveVersionChartProps } from "./curve-editor/version-chart/types";
import GridVersionChart from "./curve-editor/version-chart/GridVersionChart";

const CurveVersionChart = (props: CurveVersionChartProps) => {
  return <GridVersionChart {...props} />;
};

export default CurveVersionChart;
