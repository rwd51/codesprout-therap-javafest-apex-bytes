import React from "react";
import { ReactComponent as CatSVG } from "./svg/CatSprite.svg"; 

export default function CatSprite() {
  return (
    // Sprite Component
    <div className="character inline-block z-0">
      <CatSVG/>
    </div>
  );
}
