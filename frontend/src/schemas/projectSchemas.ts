import { z } from "zod";

// Define the schema for a project without the id field
export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.enum(["draft", "published", "Complete"]),
  publishedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  public: z.boolean(),
  githubLink: z.string().url(),
  externalLinks: z.array(z.string().url()).optional(),
  relatedDemos: z.array(z.string().url()).optional(),
  author: z.string().optional(),
  image: z.string().url().optional(),
});

// Define the schema for the entire project data structure
export const ProjectDataSchema = z.object({
  projects: z.array(ProjectSchema),
  additionalProjects: z.array(ProjectSchema),
});

// Export the projectSchema for usage
export const projectSchema = ProjectSchema;
