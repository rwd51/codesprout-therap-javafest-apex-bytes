import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

// icons
import { MdInterests } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

// values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";

//components
import Interests from "./Interests";
import ProfilePhoto from "./ProfilePhoto";
import Bio from "./Bio";
import FullScreenLoading from "../misc/FullScreenLoading";
import { USER_SERVICE_URI } from "../../env";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#2b8db3",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#2b8db3",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#2b8db3",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#2b8db3",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(25,118,210) 0%,rgb(2,136,209) 50%,rgb(0,151,167) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(25,118,210) 0%,rgb(2,136,209) 50%,rgb(0,151,167) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
    transition:
      "background-color 1s ease-in-out, height 1s ease-in-out, background-image 1s ease-in-out",
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "background-color 1s ease-in-out, box-shadow 1s ease-in-out",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(25,118,210) 0%, rgb(2,136,209) 50%, rgb(0,151,167) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    transition: "background-image 1s ease-in-out, box-shadow 1s ease-in-out",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(25,118,210) 0%, rgb(2,136,209) 50%, rgb(0,151,167) 100%)",
    transition: "background-image 1s ease-in-out",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <MdInterests fontSize={30} />,
    2: <FaPenSquare fontSize={30} />,
    3: <CgProfile fontSize={30} />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = [
  "Pick Your Interests",
  "Tell Us Something About Yourself",
  "Pick Your Profile Avatar",
];

export default function RegistrationProcess({ setAuth }) {
  const { userID } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //for interests page
  const [selectedTopics, setSelectedTopics] = useState([]);
  //for bio page
  const [bio, setBio] = useState("");
  //for profile photo page
  const [photo, setPhoto] = useState(null);

  const handleSubmitAll = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${USER_SERVICE_URI}/${userID}/infoUpdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          //'token': localStorage.token
        },
        body: JSON.stringify({
          topicInterests: selectedTopics,
          photo: photo,
          bio: bio,
        }),
      });

      const parseRes = await res.json();

      if (res.ok) {
        console.log(parseRes);
        setAuth(true);
        navigate(`/kids/${userID}`, { replace: true });
      } else {
      }
    } catch (err) {
      console.error("Error fetching", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getComponent = (state) => {
    switch (state) {
      case 0:
        return (
          <Interests
            handleNext={handleNext}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
        );
      case 1:
        return (
          <Bio
            handleNext={handleNext}
            handleBack={handleBack}
            bio={bio}
            setBio={setBio}
          />
        );
      case 2:
        return (
          <ProfilePhoto
            handleSubmitAll={handleSubmitAll}
            handleBack={handleBack}
            photo={photo}
            setPhoto={setPhoto}
          />
        );
    }
  };

  const [isLoading, setIsLoading] = useState(true);

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f1fcf0",
      }}
    >
      <div
        style={{
          paddingTop: 50,
          flexGrow: 0, // Ensures this section does not grow
        }}
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <Typography fontFamily={TITLE} fontWeight="bold">
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1, // Ensures this section occupies the remaining space
        }}
      >
        {getComponent(activeStep)}
      </div>
    </div>
  );
}
