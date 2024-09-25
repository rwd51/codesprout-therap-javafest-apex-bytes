import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

//import pages
import LandingPage from "./pages/LandingPage";

import Interests from "./components/LandingPage/Interests";

import ChatBot from "./components/ChatBot/ChatBot";

import Navbar from "./components/misc/Navbar";

import KidsPage from "./pages/KidsPage";
import ParentsPage from "./pages/ParentsPage";

import FullScreenLoading from "./components/misc/FullScreenLoading";
import Loading from "./components/misc/Loading";
import Kids from "./components/LandingPage/Kids";

import RegistrationProcess from "./components/LandingPage/RegistrationProcess";

import Bio from "./components/LandingPage/Bio";
import ProfilePhoto from "./components/LandingPage/ProfilePhoto";

import SpeechComponent from "./components/dummy";
import Badges from "./components/KidsProfilePage/Badges";

import LevelCompleteScreen from './components/CodeEditorPage/CodeEditor/components/LevelCompleteScreen'


function App() {
  const [auth, setAuth] = useState(true);
  const [userType, setUserType] = useState("parents");
  const [userID, setUserID] = useState(null);

  return (
    <>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              !auth && userType === null ? (
                <Navigate to="/landingPage" replace />
              ) : !auth && userType === "kids" ? (
                <Navigate to="/getStarted/register/:userID" replace />
              ) : userType === "kids" ? (
                <Navigate to="/kids/:userID" replace />
              ) : userType === "parents" ? (
                <Navigate to="/parents/:userID" replace />
              ) : (
                <Loading />
              )
            }
          />
          <Route
            exact
            path="/landingPage/*"
            element={
              !auth ? (
                <LandingPage
                  setAuth={setAuth}
                  setUserType={setUserType}
                  setUserID={setUserID}
                />
              ) : (
                <Navigate to="/kids" replace />
              )
            }
          />
          <Route
            exact
            path="/getStarted/register/:userID"
            element={
              !auth && userType === "kids" ? (
                <RegistrationProcess setAuth={setAuth} />
              ) : auth && userType === "kids" ? (
                <Navigate to="/kids" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            exact
            path="/kids/:userID/*"
            element={auth ? <KidsPage /> : <Navigate to="/" replace />}
          />
          <Route
            exact
            path="/parents/:userID/*"
            element={auth ? <ParentsPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
