import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

//import components
import AppBar from "../components/LandingPage/AppBar";
import Home from "../components/LandingPage/Home";
import Parents from "../components/LandingPage/Parents";
import Kids from "../components/LandingPage/Kids";
import About from "../components/LandingPage/About";
import GetStarted from "../components/LandingPage/GetStarted";
import Footer from "../components/misc/Footer";
import FullScreenLoading from "../components/misc/FullScreenLoading";

//values (for footer)
import {
  bottomText,
  email,
  phone,
  footerBackgroundColor,
  footerTextColor,
} from "../values/Footer";
import { useState } from "react";

function LandingPage({ setAuth, setUserType, setUserID }) {
  const paths = [
    "/",
    //"/about",
    "/parents",
    // "/kids",
    "/getStarted",
  ]; //always write the paths in camelcase
  const appBarLogoSrc = "/logo/CodeSprout_Full_Logo_Horizontal_Transparent.png";
  const defaultPathName = "Home";

  //for footer
  const quickLinks = [
    //"About",
    "Parents",
    //"Kids",
    "Get Started",
  ];

  //to handle loading after login or reg
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <>
      <AppBar
        paths={paths} //array of paths that correspond to the buttons in the appbar. Always keep the paths in camelcase
        appBarLogoSrc={appBarLogoSrc} //imag src of the logo
        defaultPathName={defaultPathName} //pathname corresponding to '/'
        appBarBackgroundColor="#faf6c0"
        buttonTextColor="#000"
        buttonTextColorOnActive="#fff"
        buttonBackgroundColor="transparent"
        buttonBackgroundColorOnActive="#334B71"
        buttonBorderRadius="30px"
        activeButtonColorOnHover="#2a3950"
        inactiveButtonBackgroundColorOnHover="#90D1DB" //the other names are self explanatory
        parentPath={`landingPage`}
      />

      {/**these values aren't used that much in other places of the application. So no need to localize these in the 'values' folder*/}

      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/parents"
            element={
              <Parents
                setAuth={setAuth}
                setUserType={setUserType}
                setUserID={setUserID}
                setIsLoading={setIsLoading}
              />
            }
          />
          {/* <Route path="/kids" element={<Kids />} /> */}
          <Route
            exact
            path="getStarted"
            element={
              <GetStarted
                setAuth={setAuth}
                setUserType={setUserType}
                setUserID={setUserID}
                setIsLoading={setIsLoading}
              />
            }
          />
        </Route>
      </Routes>

      <Footer
        quickLinks={quickLinks} //all the names are self-explanatory
        bottomText={bottomText}
        email={email}
        phone={phone}
        backgroundColor={footerBackgroundColor}
        textColor={footerTextColor} //text color is the color of all the texts and icons. You can customize it if you want
      />
    </>
  );
}

export default LandingPage;
