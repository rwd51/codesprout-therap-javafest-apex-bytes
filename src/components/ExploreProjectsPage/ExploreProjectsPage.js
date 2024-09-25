import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

//MUI
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  ListItem,
  List,
  IconButton,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider, DateRangePicker } from "@mui/lab";
import AdapterDateFns from "@date-io/date-fns";

//icons
import { LuRefreshCw } from "react-icons/lu";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

//components
import ProjectCard from "./ProjectCard";
import CustomRoundedButton from "../misc/CustomRoundedButton";
import UserInfoCard from "./UserInfoCard";
import AutomcompleteTextField from "../misc/AutomcompleteTextField";
import ScrollDownButton from "../misc/ScrollDownButton";
import ProjectContainer from "../YourProjectsPage/ProjectContainer";

//values
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

import { TITLE, CONTENT, TITLE_THICK } from "../../values/Fonts";
import { padding } from "@mui/system";
import {
  PROJECT_SERVICE_URI,
  USER_SERVICE_URI,
  RECOMMENDATION_SERVICE_URI,
} from "../../env";
import { filter } from "lodash";

// Example data with links
const projects = [
  {
    username: "username1",
    user_link: "/users/username1",
    user_photo: "./logo512.png",
    project_title: "Project One",
    project_link: "/projects/project1",
    tags: ["Innovation", "Technology"],
    collaborators: [
      {
        name: "Alice",
        link: "/users/alice",
        detail: "Alice is a software developer.",
      },
      { name: "Bob", link: "/users/bob", detail: "Bob is a project manager." },
    ],
    creation_date: "01/01/2024",
    post_photo: "./logo512.png",
    post_photo_link: "/projects/project1",
  },
  {
    username: "username2",
    user_link: "/users/username2",
    user_photo: "/path/to/photo2.jpg",
    project_title: "Project Two",
    project_link: "/projects/project2",
    tags: ["Health", "Wellness"],
    collaborators: [
      {
        name: "Carol",
        link: "/users/carol",
        detail: "Carol is a health specialist.",
      },
      {
        name: "Dave",
        link: "/users/dave",
        detail: "Dave is a wellness advocate.",
      },
    ],
    creation_date: "02/02/2024",
    post_photo: "/path/to/post2.jpg",
    post_photo_link: "/projects/project2",
  },
  {
    username: "username1",
    user_link: "/users/username1",
    user_photo: "/path/to/photo1.jpg",
    project_title: "Project One",
    project_link: "/projects/project1",
    tags: ["Innovation", "Technology"],
    collaborators: [
      {
        name: "Alice",
        link: "/users/alice",
        detail: "Alice is a software developer.",
      },
      { name: "Bob", link: "/users/bob", detail: "Bob is a project manager." },
    ],
    creation_date: "01/01/2024",
    post_photo: "/path/to/post1.jpg",
    post_photo_link: "/projects/project1",
  },
  {
    username: "username2",
    user_link: "/users/username2",
    user_photo: "/path/to/photo2.jpg",
    project_title: "Project Two",
    project_link: "/projects/project2",
    tags: ["Health", "Wellness"],
    collaborators: [
      {
        name: "Carol",
        link: "/users/carol",
        detail: "Carol is a health specialist.",
      },
      {
        name: "Dave",
        link: "/users/dave",
        detail: "Dave is a wellness advocate.",
      },
    ],
    creation_date: "02/02/2024",
    post_photo: "/path/to/post2.jpg",
    post_photo_link: "/projects/project2",
  },
  // Additional posts would follow the same structure
];

const suggestedCollaborators = [
  {
    username: "johndoe",
    user_photo: "https://example.com/photos/johndoe.jpg",
    level: "Gold Member",
    bio: "John is a software engineer with a passion for building scalable web applications.",
    interests: ["Coding", "Hiking", "Photography"],
    user_link: "/users/johndoe",
  },
  {
    username: "janedoe",
    user_photo: "https://example.com/photos/janedoe.jpg",
    level: "Silver Member",
    bio: "Jane is a digital marketer specializing in SEO and content strategies.",
    interests: ["Marketing", "Blogging", "Travel"],
    user_link: "/users/janedoe",
  },
  {
    username: "alicejohnson",
    user_photo: "https://example.com/photos/alicejohnson.jpg",
    level: "Bronze Member",
    bio: "Alice is a graphic designer who loves creative challenges and vibrant designs.",
    interests: ["Design", "Art", "Cycling"],
    user_link: "/users/alicejohnson",
  },
  {
    username: "bobsmith",
    user_photo: "https://example.com/photos/bobsmith.jpg",
    level: "Platinum Member",
    bio: "Bob is an entrepreneur who has started multiple successful tech startups.",
    interests: ["Entrepreneurship", "Technology", "Golf"],
    user_link: "/users/bobsmith",
  },
];

const getProjectTitles = (projects) => {
  let project_titles = [];
  for (let i = 0; i < projects.length; i++) {
    project_titles.push(projects[i].project_title);
  }
  return project_titles;
};

export const getAllUniqueValues = (posts, key) => {
  const allValues = new Set();
  posts.forEach((post) => {
    if (Array.isArray(post[key])) {
      post[key].forEach((item) => allValues.add(item));
    } else {
      allValues.add(post[key]);
    }
  });
  return Array.from(allValues);
};

const usernames = ["username1", "username2", "Alice", "Bob", "Carol", "Dave"];
const collaborators = Array.from(usernames);
const project_titles = getProjectTitles(projects);
const tags = [
  "Drawing",
  "Games",
  "Magic",
  "Maths",
  "Music",
  "Mystery",
  "Pirates",
  "Puzzles",
  "Science",
  "Adventure",
  "Aliens",
  "Ancient History",
  "Animals and Nature",
  "Cooking",
  "Dinosaurs",
  "Space",
  "Sports",
  "Stories",
  "Superheores",
  "Underwater Adventures",
];
// Utility function to generate color and its less opaque version
const tagColorMap = new Map(); // Cache to store colors for tags

function getColorForTag(tag) {
  if (tagColorMap.has(tag)) {
    return tagColorMap.get(tag);
  }

  // Generate a random color
  const random = Math.random();
  const randomColor = `hsl(${random * 360}, 70%, 50%)`;
  const lessOpaqueColor = `hsla(${random * 360}, 70%, 50%, 0.2)`;
  const colors = { text: randomColor, background: lessOpaqueColor };

  // Store in map
  tagColorMap.set(tag, colors);
  return colors;
}

const handleGenerateSuggestionsClick = () => {};

const handleGenerateCollaboratorsClick = () => {};

//function to fetch all users except me
const fetchAllUsersExceptMe = async (userID) => {
  try {
    const res = await fetch(`${USER_SERVICE_URI}/getUsersExceptMe/${userID}`, {
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

//function to get all public projects except me
const fetchAllProjects = async (userID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}/allPublic/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        //'token': localStorage.token
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
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

const fetchProjectRecommendations = async (userID, count) => {
  try {
    const res = await fetch(
      `${RECOMMENDATION_SERVICE_URI}/recommend/${userID}?count=${count}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
          //'token': localStorage.token
        },
      }
    );

    const parseRes = await res.json();
    if (res.ok) {
      const recommendations = await Promise.all(
        parseRes.map((id) => fetchProjectDetails(id))
      );

      return recommendations;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

function ExploreProjectsPage() {
  //navigation
  const navigate = useNavigate();

  const { userID } = useParams();
  const [allUsers, setAllUsers] = useState(null);
  const [projects, setProjects] = useState(null);
  const [recommendedProjects, setRecommendedProjects] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(null);

  const RECOMMENDED_PROJECTS_COUNT = 3;

  useEffect(() => {
    fetchAllUsersExceptMe(userID)
      .then((users) => {
        setAllUsers(users);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchAllProjects(userID)
      .then((allProjects) => {
        setProjects(allProjects);
        setFilteredProjects(allProjects);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchProjectRecommendations(userID, RECOMMENDED_PROJECTS_COUNT).then(
      (recommendations) => {
        console.log(recommendations);
        setRecommendedProjects(recommendations);
      }
    );
  }, [userID]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  const [dateRange, setDateRange] = useState([null, null]);

  const [selectedTitles, setSelectedTitles] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const getArrayOfAPropertyOfAnArrayOfObjects = (objectArray, property) => {
    return objectArray.map((object) => object[property]);
  };
  const getArr = getArrayOfAPropertyOfAnArrayOfObjects;

  useEffect(() => {
    //modify filtering logic later
    const filterProjects = () => {
      return projects.filter((project) => {
        return (
          (selectedTitles.length === 0 ||
            getArr(selectedTitles, "projectName").includes(
              project.projectName
            )) &&
          (selectedUsernames.length === 0 ||
            getArr(selectedUsernames, "id").includes(project.userId)) &&
          (selectedTags.length === 0 ||
            selectedTags.some((tag) => project.tags.includes(tag))) &&
          (selectedCollaborators.length === 0 ||
            project.collaborators.some((collab) =>
              getArr(selectedCollaborators, "id").includes(collab)
            ))
        );
      });
    };
    if (projects) setFilteredProjects(filterProjects());
  }, [selectedTitles, selectedUsernames, selectedTags, selectedCollaborators]);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#f2fcf0" }}>
      <Grid container spacing={2}>
        <Grid item xs={2.5}>
          <Paper
            elevation={3}
            sx={{
              height: "90vh",
              overflow: "auto",
              padding: 3,
              backgroundColor: "#f0f0f0",
            }}
          >
            <Typography
              variant="h4"
              fontFamily={TITLE}
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 5 }}
            >
              Search Filters
            </Typography>

            {projects && allUsers && (
              <>
                <AutomcompleteTextField
                  marginTop={3}
                  borderRadius="30px"
                  backgroundColor="white"
                  outlineOnFocus="black"
                  labelColorOnFocus="#334B71"
                  options={projects}
                  selectedOptions={selectedTitles}
                  setSelectedOptions={setSelectedTitles}
                  label="Project Title"
                  dropdownBgColor="#fcfcf0"
                  objectProperty="projectName"
                  // dropdownTextColor="black"
                  // dropdownTextColorOnHover="white"
                  // dropdownBgColorOnHover="red"
                  // chipBgColor="#f0f0f0"
                  // chipTextColor="black"
                  // chipBorderColor="#363535"
                  // chipDeleteIconColor="#363535"
                  // chipBgColorOnHover="#363535"
                  // chipTextColorOnHover="white"
                  // chipDeleteIconColorOnHover="white"
                  // maxDropdownHeight={150}
                  // selectedBgColor = "#cccccc"
                  // selectedTextColor = "black"
                  // selectedBgColorOnHover = "#aaaaaa"
                  // selectedTextColorOnHover = "white"
                  // clearIconColor = "black"
                  // clearIconBgColor = "transparent"
                  // clearIconColorOnHover = "white"
                  // clearIconBgColorOnHover = "black"
                />
                <AutomcompleteTextField
                  marginTop={3}
                  borderRadius="30px"
                  backgroundColor="white"
                  outlineOnFocus="black"
                  labelColorOnFocus="#334B71"
                  options={allUsers}
                  selectedOptions={selectedUsernames}
                  setSelectedOptions={setSelectedUsernames}
                  label="Username"
                  dropdownBgColor="#fcfcf0"
                  objectProperty="username"
                />
                <AutomcompleteTextField
                  marginTop={3}
                  borderRadius="30px"
                  backgroundColor="white"
                  outlineOnFocus="black"
                  labelColorOnFocus="#334B71"
                  options={allUsers}
                  selectedOptions={selectedCollaborators}
                  setSelectedOptions={setSelectedCollaborators}
                  label="Collaborators"
                  dropdownBgColor="#fcfcf0"
                  objectProperty="username"
                />
                <AutomcompleteTextField
                  marginTop={3}
                  borderRadius="30px"
                  backgroundColor="white"
                  outlineOnFocus="black"
                  labelColorOnFocus="#334B71"
                  options={tags}
                  selectedOptions={selectedTags}
                  setSelectedOptions={setSelectedTags}
                  label="Tags"
                  dropdownBgColor="#fcfcf0"
                  freeSolo={false}
                />
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <ProjectContainer
            projects={filteredProjects} //{filteredProjects}
            scroll_id={"all-projects-container"}
            title={"All Projects"}
            height={"90vh"}
          />
        </Grid>
        <Grid item xs={3.5} sx={{ display: "flex", alignItems: "center" }}>
          <img src={`${window.location.origin}/ExploreProjects/image_1.gif`} />
        </Grid>
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              marginTop: 80,
              marginBottom: 20,
            }}
          >
            <Typography fontSize={60} fontFamily={TITLE} fontWeight="bold">
              Handpicked For You
            </Typography>
          </div>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            mb: 5,
          }}
        >
          {" "}
          <img
            src={`${window.location.origin}/ExploreProjects/image_2.gif`}
            style={{ position: "absolute", top: -140, left: 0 }}
          />
          <img
            src={`${window.location.origin}/ExploreProjects/image_3.gif`}
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </Grid>
        <Grid item xs={6} sx={{ mb: 5 }}>
          {/* <Paper
            elevation={3}
            sx={{
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                p: 2.3,
                backgroundColor: "#f7f6e9",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                fontFamily={TITLE}
                fontWeight="bold"
                gutterBottom
              >
                Top Picks
              </Typography>
              <Tooltip title="Generate More Suggestions">
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateSuggestionsClick} // Reference the function you'll define next
                  sx={{
                    marginTop: "10px",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    minWidth: "50px",
                    minHeight: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    color: "#334B71",
                    backgroundColor: "#93db81",
                    "&:hover": {
                      backgroundColor: "#334B71",
                      color: "white",
                    },
                    "&.Mui-disabled": {
                      color: "#334B71",
                      backgroundColor: "#f0f0f0",
                      opacity: 0.7,
                    },
                  }}
                >
                  <LuRefreshCw />
                </IconButton>
              </Tooltip>{" "}
            </Box>
            <div
              id="top-pick-container"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                backgroundColor: "rgb(245, 245, 240,0.5)",
              }}
            >
              <List>
                {recommendedProjects &&
                  recommendedProjects.map((project, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ProjectCard project={project} />
                    </ListItem>
                  ))}
              </List>
            </div>
            <ScrollDownButton
              id="top-pick-container"
              tooltipLabel="Scroll Down"
              iconColor="#334B71"
              iconBackgroundColor="#93db81"
              iconColorOnHover="white"
              iconBackgroundColorOnHover="#334B71"
            />
          </Paper> */}
          <ProjectContainer
            projects={recommendedProjects} //{filteredProjects}
            scroll_id={"recommended-projects-container"}
            title={"Top Picks"}
            height={"90vh"}
          />
        </Grid>

        {/* <Grid item xs={12} sx={{ height: "10vh" }}></Grid>
        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              mt: 2,
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                p: 2,
                backgroundColor: "#f7f6e9",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                fontFamily={TITLE}
                fontWeight="bold"
                gutterBottom
              >
                Suggested Collaborators
              </Typography>
              <Tooltip title="Generate More Suggestions">
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateCollaboratorsClick} // Reference the function you'll define next
                  sx={{
                    marginTop: "10px",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    minWidth: "50px",
                    minHeight: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    color: "#334B71",
                    backgroundColor: "#93db81",
                    "&:hover": {
                      backgroundColor: "#334B71",
                      color: "white",
                    },
                    "&.Mui-disabled": {
                      color: "#334B71",
                      backgroundColor: "#f0f0f0",
                      opacity: 0.7,
                    },
                  }}
                >
                  <LuRefreshCw />
                </IconButton>
              </Tooltip>{" "}
            </Box>
            <div
              id="suggested-collaborators-container"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                backgroundColor: "rgb(245, 245, 240,0.5)",
              }}
            >
              <List>
                {suggestedCollaborators.map((user, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <UserInfoCard user={user} />
                  </ListItem>
                ))}
              </List>
            </div>
            <ScrollDownButton
              id="suggested-collaborators-container"
              tooltipLabel="Scroll Down"
              iconColor="#334B71"
              iconBackgroundColor="#93db81"
              iconColorOnHover="white"
              iconBackgroundColorOnHover="#334B71"
            />
          </Paper>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12} sx={{ height: "10vh" }}></Grid> */}
      </Grid>
    </Box>
  );
}

export default ExploreProjectsPage;
