import React, { useState, useEffect } from "react";
import { projectSchema } from "../schemas/projectSchemas"; // Import the Zod schema
import { z } from "zod";
import { API_URLS } from "@/config/urls"; // Import the API URLs

type AddNewProjectProps = {
  projects: any[];
  setProjects: React.Dispatch<React.SetStateAction<any[]>>;
  additionalProjects?: any[];
  setAdditionalProjects?: React.Dispatch<React.SetStateAction<any[]>>;
  editingProject?: any; // New prop for editing
  setEditingProject?: React.Dispatch<React.SetStateAction<any | null>>;
};

export default function AddNewProject({
  projects,
  setProjects,
  additionalProjects,
  setAdditionalProjects,
  editingProject,
  setEditingProject,
}: AddNewProjectProps) {
  const initialProjectState = {
    name: "",
    description: "",
    status: "Complete", // Default to "Complete"
    image: "",
    githubLink: "",
    publishedAt: "", // Date of publishing
    tags: [], // Array for tags
    public: true, // Boolean for public visibility
    externalLinks: [""], // Array of external links (URLs as strings)
  };

  const [newProject, setNewProject] = useState(initialProjectState);
  const [errors, setErrors] = useState<string[]>([]); // Store validation errors
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  useEffect(() => {
    if (editingProject) {
      setNewProject(editingProject);
      setIsEditing(true);
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleArrayChange = (index, e, fieldName) => {
    const updatedArray = [...newProject[fieldName]];
    updatedArray[index] = e.target.value;
    setNewProject({ ...newProject, [fieldName]: updatedArray });
  };

  const handleAddExternalLink = () => {
    setNewProject({
      ...newProject,
      externalLinks: [...newProject.externalLinks, ""], // Add a new empty string for a new external link
    });
  };

  // Handle form submission for both adding and editing projects
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // Clear previous errors

    try {
      const validatedProject = projectSchema.parse({
        ...newProject,
        publishedAt: newProject.publishedAt || new Date().toISOString(),
      });

      console.log("Validation succeeded:", validatedProject);

      if (isEditing) {
        // **Update existing project**
        await fetch(`${API_URLS.updateProject}/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedProject),
        });

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === editingProject.id ? validatedProject : project
          )
        );

        if (setAdditionalProjects) {
          setAdditionalProjects((prevAdditionalProjects) =>
            prevAdditionalProjects.map((project) =>
              project.id === editingProject.id ? validatedProject : project
            )
          );
        }

        setIsEditing(false);
        if (setEditingProject) setEditingProject(null);
      } else {
        // **Add new project**
        const response = await fetch(API_URLS.addProject, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validatedProject),
        });

        const data = await response.json();
        validatedProject.id = data.id; // Assign the new id from backend

        // Update frontend state for both projects and additionalProjects
        setProjects((prevProjects) => [...prevProjects, validatedProject]);

        if (setAdditionalProjects) {
          setAdditionalProjects((prevAdditionalProjects) => [
            ...prevAdditionalProjects,
            validatedProject,
          ]);
        }
      }

      // Clear form after successful submission
      setNewProject(initialProjectState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation failed:", error.errors);
        const validationErrors = error.errors.map((err) => err.message);
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit Project" : "Add New Project"}</h2>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {error}
            </p>
          ))}
        </div>
      )}

      <div>
        <label>Project Name:</label>
        <input
          type="text"
          name="name"
          value={newProject.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={newProject.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Status:</label>
        <select
          name="status"
          value={newProject.status}
          onChange={handleChange}
          required
        >
          <option value="Complete">Complete</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div>
        <label>Image URL:</label>
        <input
          type="text"
          name="image"
          value={newProject.image}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>GitHub Link:</label>
        <input
          type="text"
          name="githubLink"
          value={newProject.githubLink}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tags (comma separated):</label>
        <input
          type="text"
          name="tags"
          value={newProject.tags.join(", ")}
          onChange={(e) =>
            setNewProject({ ...newProject, tags: e.target.value.split(", ") })
          }
        />
      </div>
      <div>
        <label>Public:</label>
        <input
          type="checkbox"
          name="public"
          checked={newProject.public}
          onChange={(e) =>
            setNewProject({ ...newProject, public: e.target.checked })
          }
        />
      </div>
      <div>
        <label>External Links:</label>
        {newProject.externalLinks.map((link, index) => (
          <div key={index}>
            <input
              type="text"
              name={`externalLink_${index}`}
              placeholder="URL"
              value={link}
              onChange={(e) => handleArrayChange(index, e, "externalLinks")}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddExternalLink}>
          Add External Link
        </button>
      </div>
      <button type="submit" className="button-dark">
        {isEditing ? "Update Project" : "Add Project"}
      </button>
    </form>
  );
}
