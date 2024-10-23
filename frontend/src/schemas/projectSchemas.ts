// export const projectSchema = ProjectSchema;
import { z } from "zod";

// Define the schema for a project without the id field
export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.enum(["draft", "published", "Complete"]),
  publishedAt: z.string().optional(), // Optional field for publishing date
  tags: z.array(z.string()).optional(), // Optional array of tags
  public: z.boolean(),
  githubLink: z.string().url(), // Valid URL for GitHub link
  externalLinks: z.array(z.string().url()).optional(), // Optional array of valid URLs
  relatedDemos: z.array(z.string().url()).optional(), // Optional array of related demo URLs
  author: z.string().optional(), // Optional author field
  image: z.string().url().optional(), // Optional valid URL for the image
});

// Define the schema for the entire project data structure
export const ProjectDataSchema = z.object({
  projects: z.array(ProjectSchema),
  additionalProjects: z.array(ProjectSchema),
});

// Export the projectSchema for usage
export const projectSchema = ProjectSchema;
