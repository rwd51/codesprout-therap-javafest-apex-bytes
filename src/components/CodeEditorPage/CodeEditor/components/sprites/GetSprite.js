import React, { useState, useEffect } from "react";

//components
import Loading from "../../../../misc/Loading";

//firebase
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../../../../firebase-config"; // Adjust the path as needed

const GetSprite = ({ spriteType, charac_id }) => {
  const [spriteUrl, setSpriteUrl] = useState(null);

  useEffect(() => {
    const loadSprite = async () => {
      try {
        const folder = String(spriteType).startsWith("autodraw")
          ? "autodraw"
          : "svg";
        // path to the SVG in Firebase Storage
        const spriteRef = ref(storage, `sprites/${folder}/${spriteType}.svg`);
        // Fetch the download URL
        const url = await getDownloadURL(spriteRef);
        setSpriteUrl(url);
      } catch (error) {
        console.error(`Error loading sprite for type: ${spriteType}`, error);
        setSpriteUrl(null);
      }
    };

    loadSprite();
  }, [spriteType]);

  if (!spriteUrl)
    return (
      <div>
        {" "}
        <Loading
          sprinnerWidth="60px"
          spinnerHeight="60px"
          spinnerColor="#334B71"
          spinnerBackgroundColor="#ebfdff"
        />
      </div>
    );

  return (
    <div
      id={charac_id}
      className="character inline-block z-0"
      style={{
        minHeight: String(spriteType).startsWith("autodraw") ? "120px" : "none",
        minWidth: String(spriteType).startsWith("autodraw") ? "120px" : "none",
        border: "none",
        outline: "none",
        boxShadow: "none",
      }}
    >
      <img src={spriteUrl} alt={spriteType} style={{border: 'none'}}/>
    </div>
  );
};

export default GetSprite;
