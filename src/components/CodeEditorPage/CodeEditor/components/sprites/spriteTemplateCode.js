import React from "react";
import "./sprite.css";
import { ReactComponent as templateSVG } from "./svg/template.svg"; 

export default function template({ charac_id }) {
  return (
    // Sprite Component
    <div id={charac_id} className="character inline-block z-0">
      <templateSVG/>
    </div>
  );
}
