import React from "react";
import Svg, { Path } from "react-native-svg";

const WhistleIcon = ({ width = 24, height = 24, color = "#000" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12h20M4 8l4 4-4 4M16 8l4 4-4 4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default WhistleIcon;
