import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
const prisma = new PrismaClient();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const projectsDataPath = path.resolve(__dirname, "./src/data/project.json");

// Read the data from the JSON file
const projectData = JSON.parse(fs.readFileSync(projectsDataPath, "utf8"));

async function migrateData() {
  try {
    for (const project of projectData.projects) {
      await prisma.project.create({
        data: {
          name: project.name,
          description: project.description,
          status: project.status,
          image: project.image,
          githubLink: project.githubLink,
          publishedAt: new Date(project.publishedAt),
          tags: Array.isArray(project.tags)
            ? project.tags.join(",")
            : project.tags,
          public: project.public,
          externalLinks: {
            create: project.externalLinks.map((link) => ({
              name: link.name || "External Link",
              url: link.url,
            })),
          },
        },
      });
    }
    console.log("Data migration completed successfully.");
  } catch (error) {
    console.error("Error during data migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
