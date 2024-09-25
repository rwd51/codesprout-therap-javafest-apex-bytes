import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//MUI
import { Grid } from "@mui/material";

//components
import ProjectContainer from "../YourProjectsPage/ProjectContainer";

//URI
import { PROJECT_SERVICE_URI, USER_SERVICE_URI } from "../../env";

// Example data with links

const projects = [
  {
    projectId: "",
    projectName: "Project One",
    description: "",
    userId: "",
    clonedUserIds: [],
    creationDate: "01/01/2024",
    lastUpdateDate: "01/01/2024",
    tags: ["basic"],
    collaborators: [],
    midAreaLists: [],
    characters: [],
    active: [],
    rating: 5,
    public: true,

    // username: "username1",
    // user_link: "/users/username1",
    // user_photo: "./logo512.png",
    // project_link: "/projects/project1",
    // collaborators: [
    //   {
    //     name: "Alice",
    //     link: "/users/alice",
    //     detail: "Alice is a software developer.",
    //   },
    //   { name: "Bob", link: "/users/bob", detail: "Bob is a project manager." },
    // ],
    // post_photo: "./logo512.png",
    // post_photo_link: "/projects/project1",
  },
  {
    projectId: "",
    projectName: "Project One",
    description: "",
    userId: "",
    clonedUserIds: [],
    creationDate: "01/01/2024",
    lastUpdateDate: "01/01/2024",
    tags: ["basic"],
    collaborators: [],
    midAreaLists: [],
    characters: [],
    active: [],
    rating: 5,
    public: true,

    // username: "username1",
    // user_link: "/users/username1",
    // user_photo: "./logo512.png",
    // project_link: "/projects/project1",
    // collaborators: [
    //   {
    //     name: "Alice",
    //     link: "/users/alice",
    //     detail: "Alice is a software developer.",
    //   },
    //   { name: "Bob", link: "/users/bob", detail: "Bob is a project manager." },
    // ],
    // post_photo: "./logo512.png",
    // post_photo_link: "/projects/project1",
  },
  //...
];

//function to fetch all projects under a particular userID
const fetchYourProjects = async (userID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}/userId?id=${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    const parseRes = await res.json();
    if (res.ok) {
      return parseRes;
    }
  } catch (err) {
    console.error(err.message);
  }
};
//function to fetch details of a particular user
const fetchUserDetails = async (userID) => {
  try {
    const res = await fetch(`${USER_SERVICE_URI}/${userID}`, {
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

const fetchProjectDetails = async (projectID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}?id=${projectID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        //'token': localStorage.token
      },
    });

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

function YourProjectsPage() {
  const { userID } = useParams();

  //fetching all prjects here
  const [allProjects, setAllProjects] = useState(null);
  const [allClonedProjects, setAllClonedProjects] = useState(null);
  useEffect(() => {
    // fetchYourProjects(userID)
    //   .then((projects) => {
    //     setAllProjects(projects);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    fetchUserDetails(userID).then((user) => {
      const fetchAllOwnProjects = async () => {
        try {
          const projects = await Promise.all(
            user.projectIds.map((id) => {
              return fetchProjectDetails(id);
            })
          );
          console.log(projects);
          setAllProjects(projects);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAllOwnProjects();

      const fetchAllClonedProjects = async () => {
        try {
          const projects = await Promise.all(
            user.clonedProjectIds.map((id) => {
              return fetchProjectDetails(id);
            })
          );
          console.log(projects);
          setAllClonedProjects(projects);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAllClonedProjects();
    });
  }, [userID]);

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12} sm={6}>
          <ProjectContainer
            projects={allProjects}
            scroll_id={"view-projects-all"}
            title={"View Projects"}
            height={"89.5vh"}
            own={true}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 20, mb: 10 }}>
        <Grid item xs={12} sm={6}>
          <ProjectContainer
            projects={allClonedProjects}
            scroll_id={"suggest-project"}
            title={"Suggest Projects"}
            height={"89.5vh"}
            own={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}></Grid>
      </Grid>
    </>
  );
}

export default YourProjectsPage;
