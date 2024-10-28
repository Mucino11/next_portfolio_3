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

  const handleEdit = (project) => setEditingProject(project);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`${API_URLS.deleteProject}/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Update the local state to remove the deleted project
          setAdditionalProjects((prev) =>
            prev.filter((proj) => proj.id !== id)
          );
        } else {
          console.error("Failed to delete project from the server.");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const refreshProjects = async () => {
    // Suppose to call fetch API for additional projects and set the state with fresh data.
    const updatedProjects = await usePortfolioProjects();
    setAdditionalProjects(updatedProjects.additionalProjects);
  };

  // Re-fetch data after an add or edit operation is completed
  const handleAddOrEditComplete = () => {
    refreshProjects();
    setEditingProject(null);
  };

  if (error) return <p>{error}</p>;
  if (!additionalProjects.length) return <p>Loading...</p>;

  return (
    <div>
      <main>
        <section>
          <h1 className="project-section-h1">Additional Projects</h1>
          <section className="grid-project-section">
            {additionalProjects.map((project) => (
              <article key={project.id} className="project-card">
                <h2 className="project-h2">Name: {project.name}</h2>
                <p>Description: {project.description}</p>
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
            projects={additionalProjects}
            setProjects={setAdditionalProjects}
            editingProject={editingProject}
            setEditingProject={setEditingProject}
            onAddOrEditComplete={handleAddOrEditComplete} // Add a callback to refetch after add/edit
          />
        </section>
      </main>
    </div>
  );
}
