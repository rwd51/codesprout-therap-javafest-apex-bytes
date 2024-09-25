import React, { useEffect, useState } from "react";

//MUI
import { Grid } from "@mui/material";

//components
import ProblemContainer from "./ProblemContainer";

//values
import { PROBLEMS_SERVICE_URI } from "../../env";

const fetchProbelmsOfACategory = async (category) => {
  try {
    const res = await fetch(`${PROBLEMS_SERVICE_URI}/category/${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    const parseRes = await res.json();
    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

function ProblemsPage() {
  const [beginnerProblems, setBeginnerProblems] = useState(null);
  const [intermediateProblems, setInterMediateProblems] = useState(null);
  const [advancedProblems, setAdvancedProblems] = useState(null);
  useEffect(() => {
    fetchProbelmsOfACategory("Beginner")
      .then((problems) => {
        console.log(problems);
        setBeginnerProblems(problems);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchProbelmsOfACategory("Intermediate")
      .then((problems) => {
        console.log(problems);
        setInterMediateProblems(problems);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchProbelmsOfACategory("Advanced")
      .then((problems) => {
        console.log(problems);
        setAdvancedProblems(problems);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Grid container>
      <Grid item xs={6} sx={{ position: "relative" }}>
        <img
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "400px",
            height: "auto",
          }}
          src={`${window.location.origin}/Problems/image-2.gif`}
        />
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "400px",
            height: "auto",
          }}
          src={`${window.location.origin}/Problems/image-1.gif`}
        />
      </Grid>
      <Grid item xs={6}>
        <ProblemContainer
          problems={beginnerProblems}
          title="Beginner"
          scroll_id="beginner-probelms-container"
          height="90vh"
        />
      </Grid>
      <Grid item xs={6} sx={{ mt: 20 }}>
        <ProblemContainer
          problems={intermediateProblems}
          title="Intermediate"
          scroll_id="intermediate-probelms-container"
          height="90vh"
        />
      </Grid>
      <Grid item xs={6} sx={{ position: "relative", mt: 20 }}>
        <img
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "400px",
            height: "auto",
          }}
          src={`${window.location.origin}/Problems/image-4.gif`}
        />
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "400px",
            height: "auto",
          }}
          src={`${window.location.origin}/Problems/image-3.gif`}
        />
      </Grid>
      <Grid item xs={6} sx={{ position: "relative", mt: 20, mb: 10 }}>
        <img
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "400px",
            height: "auto",
          }}
          src={`${window.location.origin}/Problems/image-5.gif`}
        />
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "350px",
            height: "auto",
          }}
          src={`${window.location.origin}/Problems/image-6.gif`}
        />
      </Grid>
      <Grid item xs={6} sx={{ mt: 20, mb: 10 }}>
        <ProblemContainer
          problems={advancedProblems}
          title="Advanced"
          scroll_id="advanced-probelms-container"
          height="90vh"
        />
      </Grid>
    </Grid>
  );
}

export default ProblemsPage;
