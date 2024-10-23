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
  const [projects, setProjects] = useState([]);
  const [additionalProjects, setAdditionalProjects] = useState([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(API_URLS.projects);
        const data = await response.json();
        setProjects(data.projects);
        setAdditionalProjects(data.additionalProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Error fetching projects");
      }
    };

    fetchProjects();
  }, []);

  return { projects, additionalProjects, error };
};
