import React, { useState } from "react";

export default function AddNewProject({
  projects,
  setProjects,
  additionalProjects,
  setAdditionalProjects,
}) {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "",
    image: "",
    githubLink: "",
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Update projects
    setProjects((prevProjects) => [...prevProjects, newProject]);

    // Update additionalProjects
    setAdditionalProjects((prevAdditionalProjects) => [
      ...prevAdditionalProjects,
      newProject,
    ]);

    // Clear form
    setNewProject({
      name: "",
      description: "",
      status: "",
      image: "",
      githubLink: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <input
          type="text"
          name="status"
          value={newProject.status}
          onChange={handleChange}
          required
        />
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
      <button type="submit" className="button-dark">
        Add Project
      </button>
    </form>
  );
}
