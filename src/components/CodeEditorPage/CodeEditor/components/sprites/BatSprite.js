import React from "react";
import { ReactComponent as BatSVG } from "./svg/BatSprite.svg";  // Import SVG as React Component



export default function BatSprite() {
  return (
    <div className="character inline-block z-0">
      <BatSVG />
    </div>
  );
}

