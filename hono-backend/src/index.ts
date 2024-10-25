// // JSON BASED BACKEND @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// import { Hono } from "hono";
// import { serve } from "@hono/node-server";
// import { cors } from "hono/cors"; // CORS middleware
// import path from "path";
// import fs from "fs";

// const app = new Hono();

// // Enable CORS for frontend requests
// app.use(
//   "*",
//   cors({
//     origin: "http://localhost:3000", // Allow requests from your frontend
//     allowMethods: ["GET", "POST", "PUT", "DELETE"], // Allow all methods
//   })
// );

// // Load project data
// const projectsDataPath = path.resolve(__dirname, "./data/project.json");
// let projectsData = JSON.parse(fs.readFileSync(projectsDataPath, "utf8"));

// // Assign unique IDs to projects if they don't have one
// const assignIds = (projectsArray) => {
//   return projectsArray.map((project, index) => {
//     return {
//       id: project.id || index + 1,
//       ...project,
//       publishedAt: project.publishedAt || new Date().toISOString(), // Add current date if 'publishedAt' is missing
//     };
//   });
// };

// // Ensure that both 'projects' and 'additionalProjects' have unique IDs
// projectsData.projects = assignIds(projectsData.projects);
// projectsData.additionalProjects = assignIds(projectsData.additionalProjects);

// // Serve the projects data
// app.get("/projects", (c) => {
//   return c.json(projectsData);
// });

// // Handle adding a new project via POST request
// app.post("/addProject", async (c) => {
//   const newProject = await c.req.json();
//   newProject.id = projectsData.projects.length + 1; // Assign a new id

//   // Add to both 'projects' and 'additionalProjects'
//   projectsData.projects.push(newProject);
//   projectsData.additionalProjects.push({ ...newProject }); // Duplicate the project in 'additionalProjects'

//   // Save the updated project data back to the JSON file
//   fs.writeFileSync(
//     projectsDataPath,
//     JSON.stringify(projectsData, null, 2),
//     "utf8"
//   );

//   return c.json({
//     success: true,
//     message: "Project added successfully",
//     id: newProject.id,
//   });
// });

// // Update a project (PUT request)
// app.put("/updateProject/:id", async (c) => {
//   const id = parseInt(c.req.param("id"));
//   const updatedProject = await c.req.json();

//   const projectIndex = projectsData.projects.findIndex((p) => p.id === id);
//   const additionalProjectIndex = projectsData.additionalProjects.findIndex(
//     (p) => p.id === id
//   );

//   if (projectIndex !== -1) {
//     // Update project in 'projects'
//     projectsData.projects[projectIndex] = {
//       ...projectsData.projects[projectIndex],
//       ...updatedProject,
//     };

//     // Update project in 'additionalProjects'
//     if (additionalProjectIndex !== -1) {
//       projectsData.additionalProjects[additionalProjectIndex] = {
//         ...projectsData.additionalProjects[additionalProjectIndex],
//         ...updatedProject,
//       };
//     }

//     fs.writeFileSync(
//       projectsDataPath,
//       JSON.stringify(projectsData, null, 2),
//       "utf8"
//     );

//     return c.json({ success: true, message: "Project updated successfully" });
//   }

//   return c.json({ success: false, message: "Project not found" }, 404);
// });

// // Delete a project (DELETE request)
// app.delete("/deleteProject/:id", async (c) => {
//   const id = parseInt(c.req.param("id"));

//   // Find project in 'projects'
//   const projectIndex = projectsData.projects.findIndex((p) => p.id === id);
//   // Find project in 'additionalProjects'
//   const additionalProjectIndex = projectsData.additionalProjects.findIndex(
//     (p) => p.id === id
//   );

//   let projectDeleted = false;

//   if (projectIndex !== -1) {
//     // Remove from 'projects'
//     projectsData.projects.splice(projectIndex, 1);
//     projectDeleted = true;
//   }

//   if (additionalProjectIndex !== -1) {
//     // Remove from 'additionalProjects'
//     projectsData.additionalProjects.splice(additionalProjectIndex, 1);
//     projectDeleted = true;
//   }

//   if (projectDeleted) {
//     // Save the updated project data back to the JSON file
//     fs.writeFileSync(
//       projectsDataPath,
//       JSON.stringify(projectsData, null, 2),
//       "utf8"
//     );
//     return c.json({ success: true, message: "Project deleted successfully" });
//   }

//   return c.json({ success: false, message: "Project not found" }, 404);
// });

// const port = 3001;
// console.log(`Server is running on http://localhost:${port}`);

// serve({
//   fetch: app.fetch,
//   port,
// });
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors"; // CORS middleware
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient(); // Initialize Prisma client

// Enable CORS for frontend requests
app.use(
  "*",
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Allow all methods
  })
);

// Serve the projects data from the database
app.get("/projects", async (c) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        externalLinks: true, // Include external links if needed
      },
    });
    return c.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ success: false, message: "Error fetching projects" }, 500);
  }
});

// Handle adding a new project via POST request
app.post("/addProject", async (c) => {
  try {
    const newProject = await c.req.json();

    // Create project in the database
    const createdProject = await prisma.project.create({
      data: {
        name: newProject.name,
        description: newProject.description,
        status: newProject.status,
        image: newProject.image,
        githubLink: newProject.githubLink,
        publishedAt: new Date(newProject.publishedAt || Date.now()),
        tags: newProject.tags.join(", "), // Join tags as a string for now
        public: newProject.public,
        externalLinks: {
          create: newProject.externalLinks.map((link) => ({
            name: link.name,
            url: link.url,
          })),
        },
        author: newProject.author,
      },
    });

    return c.json({
      success: true,
      message: "Project added successfully",
      project: createdProject,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    return c.json({ success: false, message: "Error adding project" }, 500);
  }
});

// Update a project (PUT request)
app.put("/updateProject/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  try {
    const updatedProject = await c.req.json();

    const updated = await prisma.project.update({
      where: { id: id },
      data: {
        name: updatedProject.name,
        description: updatedProject.description,
        status: updatedProject.status,
        image: updatedProject.image,
        githubLink: updatedProject.githubLink,
        publishedAt: new Date(updatedProject.publishedAt),
        tags: updatedProject.tags.join(", "),
        public: updatedProject.public,
        externalLinks: {
          deleteMany: {}, // Remove existing external links
          create: updatedProject.externalLinks.map((link) => ({
            name: link.name,
            url: link.url,
          })),
        },
        author: updatedProject.author,
      },
    });

    return c.json({
      success: true,
      message: "Project updated successfully",
      project: updated,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({ success: false, message: "Error updating project" }, 500);
  }
});

// Delete a project (DELETE request)
app.delete("/deleteProject/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    await prisma.project.delete({
      where: { id: id },
    });

    return c.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ success: false, message: "Error deleting project" }, 500);
  }
});

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
app.get("/projects", async (c) => {
  try {
    const projects = await prisma.project.findMany();
    return c.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ success: false, message: "Error fetching projects" });
  }
});
