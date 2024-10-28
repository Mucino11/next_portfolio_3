import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono();

// Enable CORS for frontend requests
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const projectsDataPath = path.resolve(__dirname, "./data/project.json");
let projectsData = JSON.parse(fs.readFileSync(projectsDataPath, "utf8"));

// Zod schema for project validation
const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.string(),
  image: z.string().optional(),
  githubLink: z.string().url(),
  publishedAt: z.string().optional(),
  tags: z.string(),
  public: z.boolean(),
  externalLinks: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
    })
  ),
});

// Helper function to assign unique IDs and dates if missing
const assignIds = (projectsArray) => {
  return projectsArray.map((project, index) => {
    return {
      id: project.id || index + 1,
      ...project,
      publishedAt: project.publishedAt || new Date().toISOString(),
    };
  });
};

// Ensure both 'projects' and 'additionalProjects' have unique IDs
projectsData.projects = assignIds(projectsData.projects);
projectsData.additionalProjects = assignIds(projectsData.additionalProjects);

// Get all projects
app.get("/projects", (c) => {
  return c.json(projectsData);
});

// Add a new project via POST request with Zod validation
app.post("/addProject", async (c) => {
  try {
    const newProject = projectSchema.parse(await c.req.json());
    newProject.id = projectsData.projects.length + 1;

    projectsData.projects.push(newProject);
    projectsData.additionalProjects.push({ ...newProject });

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
  } catch (error) {
    return c.json(
      { success: false, message: "Validation error", errors: error.errors },
      400
    );
  }
});

// Update a project via PUT request with Zod validation
app.put("/updateProject/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  try {
    const updatedProject = projectSchema.parse(await c.req.json());

    const projectIndex = projectsData.projects.findIndex((p) => p.id === id);
    const additionalProjectIndex = projectsData.additionalProjects.findIndex(
      (p) => p.id === id
    );

    if (projectIndex !== -1) {
      projectsData.projects[projectIndex] = {
        ...projectsData.projects[projectIndex],
        ...updatedProject,
      };

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
  } catch (error) {
    return c.json(
      { success: false, message: "Validation error", errors: error.errors },
      400
    );
  }
});

app.delete("/projects/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const projectIndex = projectsData.projects.findIndex((p) => p.id === id);
  const additionalProjectIndex = projectsData.additionalProjects.findIndex(
    (p) => p.id === id
  );

  let projectDeleted = false;

  if (projectIndex !== -1) {
    projectsData.projects.splice(projectIndex, 1);
    projectDeleted = true;
  }

  if (additionalProjectIndex !== -1) {
    projectsData.additionalProjects.splice(additionalProjectIndex, 1);
    projectDeleted = true;
  }

  if (projectDeleted) {
    fs.writeFileSync(
      projectsDataPath,
      JSON.stringify(projectsData, null, 2),
      "utf8"
    );
    return c.json({ success: true, message: "Project deleted successfully" });
  }

  return c.json({ success: false, message: "Project not found" }, 404);
});

// Fetch one project by ID
app.get("/project/:id", async (c) => {
  const id = parseInt(c.req.param("id")); // Extract ID from request parameters

  try {
    // Find the project by ID
    const project = projectsData.projects.find((p) => p.id === id);

    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    return c.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json({ success: false, message: "Error fetching project" }, 500);
  }
});

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
