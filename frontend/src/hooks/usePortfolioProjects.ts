// import { useState, useEffect } from "react";
// import { API_URLS } from "@/config/urls";
// // Define the type for Project
// type Project = {
//   name: string;
//   description: string;
//   status: string;
//   image: string;
//   githubLink: string;
//   publishedAt?: string; // Optional field for published date
// };

// export const usePortfolioProjects = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [additionalProjects, setAdditionalProjects] = useState<Project[]>([]); // Add additionalProjects state
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch("http://localhost:3001/projects"); // Replace with your backend endpoint
//         const data = await response.json();

//         // Assume the backend returns both projects and additionalProjects
//         setProjects(data.projects);
//         setAdditionalProjects(data.additionalProjects); // Set additionalProjects from backend
//       } catch (err) {
//         setError("Failed to fetch projects");
//         console.error(err);
//       }
//     };

//     fetchProjects();
//   }, []);

//   return { projects, additionalProjects, error };
// };
import { useState, useEffect } from "react";
import { API_URLS } from "@/config/urls";

// Define the type for Project
type Project = {
  name: string;
  description: string;
  status: string;
  image: string;
  githubLink: string;
  publishedAt?: string; // Optional field for published date
};

export const usePortfolioProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [additionalProjects, setAdditionalProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(API_URLS.projects); // Use API URL for fetching projects
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Set projects and additionalProjects based on the data received from backend
        setProjects(data.projects || []);
        setAdditionalProjects(data.additionalProjects || []);
      } catch (err) {
        setError("Failed to fetch projects");
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return { projects, additionalProjects, error };
};
