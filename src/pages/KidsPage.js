import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

//MUI
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";

//components
import Navbar from "../components/misc/Navbar";
import Footer from "../components/misc/Footer";

//components (Pages)
import ChatBotPage from "../components/ChatBot/ChatBotPage";
import ExploreProjectsPage from "../components/ExploreProjectsPage/ExploreProjectsPage";
import KidsProfilePage from "../components/KidsProfilePage/KidsProfilePage";
import ProfilePage from "../components/KidsProfilePage/ProfilePage";
import ProjectInfoPage from "../components/ProjectInfoPage/ProjectInfoPage";
import CodeEditorPage from "../components/CodeEditorPage/CodeEditorPage";
import YourProjectsPage from "../components/YourProjectsPage/YourProjectsPage";
import ProblemsPage from "../components/ProblemsPage/ProblemsPage";
import FullScreenLoading from "../components/misc/FullScreenLoading";
import Loading from "../components/misc/Loading";
import ConnectWithParent from "../components/ConnectWithParent/ConnectWithParent";

//icons
import { MdLandscape } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";

//values
import {
  bottomText,
  email,
  phone,
  footerBackgroundColor,
  footerTextColor,
} from "../values/Footer";

function Icon({ imageName }) {
  //considering that the image is in the public folder in a particular directory
  return (
    <Avatar
      alt={imageName}
      src={`${window.location.origin}/SideBar/${imageName}.svg`}
      sx={{ width: 70, height: 70, bgcolor: "white" }} // Set the size of the icon
    />
  );
}

function KidsPage({setAuth, setUserType}) {
  const menuItem = [
    {
      path: "./chatBot",
      name: "Chat Bot",
      icon: <Icon imageName="robot" />,
    },
    {
      path: "./exploreProjects",
      name: "Explore Projects",
      icon: <Icon imageName="search" />,
    },
    {
      path: "./yourProjects",
      name: "Your Projects",
      icon: <Icon imageName="project" />,
    },
    {
      path: "./problems",
      name: "Problems",
      icon: <Icon imageName="idea" />,
    },
    {
      path: "./codeEditor",
      name: "Code Editor",
      icon: <Icon imageName="games" />,
    },
    {
      path: "./profile",
      name: "Profile",
      icon: <Icon imageName="account-stats" />,
    },
    {
      path: "./connectWithParent",
      name: "Connect With Parent",
      icon: <Icon imageName="network" />,
    },
    // {
    //   path: "./projectInfo",
    //   name: "Project Info",
    //   icon: <MdLandscape />,
    // },
    {
      name: "Logout", // No path needed for logout
      icon: <Icon imageName="arrow" />,
      action: "logout", // Additional field to identify logout action
    },
  ];

  //for the navbar
  const paths = [
    "/",
    "/profile",
    "/chatBot",
    "/exploreProjects",
    "./yourProjects",
    "./problems",
    "/codeEditor",
    "/connectWithParent",
    "/logOut",
  ]; //always write the paths in camelcase
  const appBarLogoSrc = "/logo/CodeSprout_Icon_Transparent.png";
  const defaultPathName = "Home";

  //for footer
  const quickLinks = [
    "Chat Bot",
    "Explore Projects",
    "Your Projects",
    "Problems",
    "Code Editor",
    "Profile",
    "Project Info",
    "Home",
    "Profile",
    "Connect With Parent",
  ];

  const [isLoading, setIsLoading] = useState(true);

  //handling loading during creating, updating, and cloning project
  const [loadingScreen, setLoadingScreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <div style={{ position: "relative" }}>
      <Navbar
        paths={paths} //array of paths that correspond to the buttons in the appbar
        appBarLogoSrc={appBarLogoSrc} //imag src of the logo
        defaultPathName={defaultPathName} //pathname corresponding to '/'
        appBarBackgroundColor="#faf6c0"
        buttonTextColor="#000"
        buttonTextColorOnActive="#fff"
        buttonBackgroundColor="transparent"
        buttonBackgroundColorOnActive="#334B71"
        buttonBorderRadius="30px"
        activeButtonColorOnHover="#2a3950"
        inactiveButtonBackgroundColorOnHover="#90D1DB"
        inactiveButtonColorOnHover="black"
        menuItem={menuItem}
        //sideBarIconColor="black"
        //sideBarIconBackGroundColor= "transparent"
        // sideBarIconColorOnHover="white"
        // sideBarIconBackGroundColorOnhover="black"
        sideBarColor="#fcfbe6"
        // sideBarItemColor="black"
        // sideBarItemColorOnHover="white"
        sideBarItemBackgroundColorOnHover="#334B71"
        notificationsIconColor="white"
        notificationsBackgroundColor="#334B71"
        notificationsIconColorOnHover="yellow"
        notificationsBackgroundColorOnHover="black"
        parentPath="kids"
        setAuth={setAuth}
        setUserType={setUserType}
      />
      {/* These values aren't used that much in other places of the application. So no need to localize these in the 'values' folder 
                Also this navbar will be used in the KidsPage, ParentsPage, and AdminPage. So, without localizing the styles, option have been kept to make those styles different for those Navbars */}

      {/* <Box sx={{height:'100vh'}}>

                </Box> */}

      <Box sx={{ pt: 10 }}>
        {" "}
        {/* pt for padding-top */}
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="/" element={<Navigate to="./profile" replace />} />
            <Route path="/chatBot" element={<ChatBotPage />} />
            <Route path="/exploreProjects" element={<ExploreProjectsPage setLoadingScreen={setLoadingScreen}/>} />
            <Route path="/yourProjects" element={<YourProjectsPage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/profile" element={<KidsProfilePage />} />
            <Route path="/connectWithParent" element={<ConnectWithParent />} />
            <Route path="/profile/:ID" element={<ProfilePage setLoadingScreen={setLoadingScreen}/>} />
            <Route
              path="/projectInfo/:projectID"
              element={<ProjectInfoPage />}
            />
            <Route
              path="/codeEditor/:projectID/:problemID"
              element={<CodeEditorPage setLoadingScreen={setLoadingScreen} />}
            />
            <Route
              path="/codeEditor"
              element={<CodeEditorPage setLoadingScreen={setLoadingScreen} />}
            />
          </Route>
        </Routes>
      </Box>

      <Footer
        quickLinks={quickLinks} //all the names are self-explanatory
        bottomText={bottomText}
        email={email}
        phone={phone}
        backgroundColor={footerBackgroundColor}
        textColor={footerTextColor} //text color is the color of all the texts and icons. You can customize it if you want
      />
      {loadingScreen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            //alignItems: "center",
            backgroundColor: "#edffe8",
            opacity: 0.8,
            padding: 230,
            zIndex: 2000,
          }}
        >
          <Loading
            spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
            sprinnerWidth="350px"
            spinnerHeight="350px"
            spinnerImageWidth="300px"
            spinnerImageHeight="300px"
            spinnerColor="#334B71"
            spinnerBackgroundColor="#ebfdff"
          />
        </div>
      )}
    </div>
  );
}

export default KidsPage;
