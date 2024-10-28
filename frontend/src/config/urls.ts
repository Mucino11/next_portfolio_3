const BASE_URL = "http://localhost:3001"; // Backend API URL

export const API_URLS = {
  projects: `${BASE_URL}/projects`,
  addProject: `${BASE_URL}/addProject`,
  deleteProject: (projectId: string) => `${BASE_URL}/projects/${projectId}`, // Dynamic URL for deleting a project
  updateProject: (projectId: string) => `${BASE_URL}/projects/${projectId}`, // Dynamic URL for updating a project
};

export const FRONTEND_URLS = {
  home: "/",
  projectPage: "/projects",
  addProjectPage: "/projects/add",
};
