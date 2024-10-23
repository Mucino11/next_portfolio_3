// pages/project.tsx
import { useEffect, useState } from "react";
import AddNewProject from "@/components/Form";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";
import { format } from "date-fns";
import { API_URLS } from "@/config/urls";

export default function Project() {
  const { additionalProjects: fetchedAdditionalProjects, error } =
    usePortfolioProjects();

  const [additionalProjects, setAdditionalProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    if (fetchedAdditionalProjects) {
      setAdditionalProjects(fetchedAdditionalProjects);
    }
  }, [fetchedAdditionalProjects]);

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await fetch(`${API_URLS.deleteProject}/${id}`, { method: "DELETE" });

        // Update state to remove the deleted project
        setAdditionalProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (error) return <p>{error}</p>;
  if (!additionalProjects.length) return <p>Loading...</p>;

  return (
    <div>
      <main>
        <section>
          <h1 className="project-section-h1">Additional Projects</h1>
          <section className="grid-project-section">
            {additionalProjects.map((project, index) => (
              <article key={index} className="project-card">
                <h2 className="project-h2">Name: {project.name}</h2>
                <p>Description: {project.description}</p>
                <p>Status: {project.status}</p>
                {project.publishedAt && (
                  <p>
                    Published on:{" "}
                    {format(new Date(project.publishedAt), "MMMM dd, yyyy")}
                  </p>
                )}
                {project.tags && <p>Tags: {project.tags.join(", ")}</p>}
                <p>{project.public ? "Public" : "Private"}</p>

                {project.externalLinks && project.externalLinks.length > 0 && (
                  <p>
                    External Links:{" "}
                    {project.externalLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </a>
                    ))}
                  </p>
                )}

                {project.relatedDemos && project.relatedDemos.length > 0 && (
                  <p>
                    Related Demos:{" "}
                    {project.relatedDemos.map((demo, idx) => (
                      <a
                        key={idx}
                        href={demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Demo {idx + 1}
                      </a>
                    ))}
                  </p>
                )}

                {project.author && <p>Author: {project.author}</p>}

                <img
                  src={project.image}
                  alt={`${project.name} image`}
                  className="portfolio-image"
                />
                <div>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="button-dark">See Project</button>
                  </a>
                  <button
                    onClick={() => handleEdit(project)}
                    className="button-dark"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="button-dark"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>

          <AddNewProject
            projects={additionalProjects}
            setProjects={setAdditionalProjects}
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />
        </section>
      </main>
    </div>
  );
}
