// This is where the fetch logic is moved to keep the hook clean
export const getProjects = async () => {
  const response = await fetch("http://localhost:3001/projects"); // Replace with your Hono backend URL
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};
