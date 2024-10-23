import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors"; // CORS middleware
import path from "path";
import fs from "fs";

const app = new Hono();

// Enable CORS for frontend requests
app.use(
  "*",
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Allow all methods
  })
);

// Load project data
const projectsDataPath = path.resolve(__dirname, "./data/project.json");
let projectsData = JSON.parse(fs.readFileSync(projectsDataPath, "utf8"));

// Assign unique IDs to projects if they don't have one
const assignIds = (projectsArray) => {
  return projectsArray.map((project, index) => {
    return {
      id: project.id || index + 1,
      ...project,
      publishedAt: project.publishedAt || new Date().toISOString(), // Add current date if 'publishedAt' is missing
    };
  });
};

// Ensure that both 'projects' and 'additionalProjects' have unique IDs
projectsData.projects = assignIds(projectsData.projects);
projectsData.additionalProjects = assignIds(projectsData.additionalProjects);

// Serve the projects data
app.get("/projects", (c) => {
  return c.json(projectsData);
});

// Handle adding a new project via POST request
app.post("/addProject", async (c) => {
  const newProject = await c.req.json();
  newProject.id = projectsData.projects.length + 1; // Assign a new id

  // Add to both 'projects' and 'additionalProjects'
  projectsData.projects.push(newProject);
  projectsData.additionalProjects.push({ ...newProject }); // Duplicate the project in 'additionalProjects'

  // Save the updated project data back to the JSON file
  fs.writeFileSync(
    projectsDataPath,
    JSON.stringify(projectsData, null, 2),
    "utf8"
  );

  return c.json({
    success: true,
    message: "Project added successfully",
    id: newProject.id,
  });
});

// Update a project (PUT request)
app.put("/updateProject/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const updatedProject = await c.req.json();

  const projectIndex = projectsData.projects.findIndex((p) => p.id === id);
  const additionalProjectIndex = projectsData.additionalProjects.findIndex(
    (p) => p.id === id
  );

  if (projectIndex !== -1) {
    // Update project in 'projects'
    projectsData.projects[projectIndex] = {
      ...projectsData.projects[projectIndex],
      ...updatedProject,
    };

    // Update project in 'additionalProjects'
    if (additionalProjectIndex !== -1) {
      projectsData.additionalProjects[additionalProjectIndex] = {
        ...projectsData.additionalProjects[additionalProjectIndex],
        ...updatedProject,
      };
    }

    fs.writeFileSync(
      projectsDataPath,
      JSON.stringify(projectsData, null, 2),
      "utf8"
    );

    return c.json({ success: true, message: "Project updated successfully" });
  }

  return c.json({ success: false, message: "Project not found" }, 404);
});

// Delete a project (DELETE request)
app.delete("/deleteProject/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  // Find project in 'projects'
  const projectIndex = projectsData.projects.findIndex((p) => p.id === id);
  // Find project in 'additionalProjects'
  const additionalProjectIndex = projectsData.additionalProjects.findIndex(
    (p) => p.id === id
  );

  let projectDeleted = false;

  if (projectIndex !== -1) {
    // Remove from 'projects'
    projectsData.projects.splice(projectIndex, 1);
    projectDeleted = true;
  }

  if (additionalProjectIndex !== -1) {
    // Remove from 'additionalProjects'
    projectsData.additionalProjects.splice(additionalProjectIndex, 1);
    projectDeleted = true;
  }

  if (projectDeleted) {
    // Save the updated project data back to the JSON file
    fs.writeFileSync(
      projectsDataPath,
      JSON.stringify(projectsData, null, 2),
      "utf8"
    );
    return c.json({ success: true, message: "Project deleted successfully" });
  }

  return c.json({ success: false, message: "Project not found" }, 404);
});

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
