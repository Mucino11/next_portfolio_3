// src/config/urls.ts

const BASE_URL = "http://localhost:3001"; // Backend API base URL

export const API_URLS = {
  projects: `${BASE_URL}/projects`,
  addProject: `${BASE_URL}/addProject`,
  deleteProject: (projectId: string) => `${BASE_URL}/projects/${projectId}`, // Example of a dynamic URL for deleting a project
  updateProject: (projectId: string) => `${BASE_URL}/projects/${projectId}`, // Example of a dynamic URL for updating a project
};

export const FRONTEND_URLS = {
  home: "/",
  projectPage: "/projects",
  addProjectPage: "/projects/add", // Example for frontend page URL
};
