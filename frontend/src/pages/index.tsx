import Skill from "@/components/Skills";
import AddNewProject from "@/components/Form";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { API_URLS } from "@/config/urls";

export default function Home() {
  const {
    projects,
    additionalProjects: fetchedAdditionalProjects,
    error,
  } = usePortfolioProjects();
  const [projectsState, setProjectsState] = useState([]);
  const [additionalProjects, setAdditionalProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    if (projects && fetchedAdditionalProjects) {
      setProjectsState(projects);
      setAdditionalProjects(fetchedAdditionalProjects);
    }
  }, [projects, fetchedAdditionalProjects]);

  const handleEdit = (project) => setEditingProject(project);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await fetch(`${API_URLS.deleteProject}/${id}`, { method: "DELETE" });
        setProjectsState((prev) => prev.filter((proj) => proj.id !== id));
        setAdditionalProjects((prev) => prev.filter((proj) => proj.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (error) return <p>{error}</p>;
  if (!projectsState.length) return <p>Loading...</p>;

  return (
    <div>
      <main>
        <section>
          <h1 className="project-section-h1">My Projects</h1>
          <section className="grid-project-section">
            {projectsState.map((project) => (
              <article key={project.id} className="project-card">
                <h2 className="project-h2">Name: {project.name}</h2>
                <p>Descriptions: {project.description}</p>
                <p>Status: {project.status}</p>
                <p>
                  Published on:{" "}
                  {format(new Date(project.publishedAt), "MMMM dd, yyyy")}
                </p>
                <p>
                  Tags:{" "}
                  {Array.isArray(project.tags)
                    ? project.tags.join(", ")
                    : project.tags}
                </p>
                <p>{project.public ? "Public" : "Private"}</p>

                {project.externalLinks?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                ))}

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
            projects={projectsState}
            setProjects={setProjectsState}
            additionalProjects={additionalProjects}
            setAdditionalProjects={setAdditionalProjects}
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />
        </section>
        <Skill />
      </main>
    </div>
  );
}
