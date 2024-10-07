import { useEffect, useState } from "react";
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

import LevelCompleteScreen from "./components/CodeEditorPage/CodeEditor/components/LevelCompleteScreen";

//values
import { USER_SERVICE_URI } from "./env";

function App() {
  const [auth, setAuth] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userID, setUserID] = useState(null);

  const checkAuthenticated = async () => {
    try {
      const res = await fetch(`${USER_SERVICE_URI}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        // body: JSON.stringify({
        //   /*request body*/
        // }),
      });

      const parseRes = await res.json();

      if (res.ok) {
        if (parseRes.success === true) {
          setAuth(true);
          setUserType(parseRes.role_name);
        } else {
          setAuth(false);
          setUserType(null);
        }
      } else {
        setAuth(false);
        setUserType(null);
      }
    } catch (err) {
      console.error("Error fetching /*...*/", err.message);
      setAuth(false);
      setUserType(null);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  if (auth === null) {
    return <FullScreenLoading />;
  }

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
            element={auth ? <KidsPage setAuth={setAuth} setUserType={setUserType}/> : <Navigate to="/" replace />}
          />
          <Route
            exact
            path="/parents/:userID/*"
            element={auth ? <ParentsPage setAuth={setAuth} setUserType={setUserType}/> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
