import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDataPath = path.resolve(__dirname, "./src/data/project.json");
const projectData = JSON.parse(fs.readFileSync(projectsDataPath, "utf8"));

// Check if a date is valid
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date);
}

async function migrateData() {
  try {
    for (const project of projectData.projects) {
      const publishedAt = isValidDate(project.publishedAt)
        ? new Date(project.publishedAt)
        : new Date();

      await prisma.project.create({
        data: {
          name: project.name,
          description: project.description,
          status: project.status,
          image: project.image,
          githubLink: project.githubLink,
          publishedAt,
          tags: Array.isArray(project.tags)
            ? project.tags.join(",")
            : project.tags,
          public: project.public,
          externalLinks: {
            create: project.externalLinks
              .filter((link) => link.url)
              .map((link) => ({
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
