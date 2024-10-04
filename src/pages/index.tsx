import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Skill from "@/components/Skills";
import AddNewProject from "@/components/Form";
import Link from "next/link";

type Project = {
  name: string;
  description: string;
  status: string;
  image: string;
  githubLink: string;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [additionalProjects, setAdditionalProjects] = useState<Project[]>([]); // Add state for additionalProjects

  // Fetch the project data from the public folder
  useEffect(() => {
    fetch("/data/project.json")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <main>
        <section>
          <h1 className="project-section-h1">My Projects</h1>
          <section className="grid-project-section">
            {/* Map over the fetched projects and create project cards */}
            {projects.map((project, index) => (
              <article key={index} className="project-card">
                <h2 className="project-h2">Name: {project.name}</h2>
                <p>Description: {project.description}</p>
                <p>Status: {project.status}</p>
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
                </div>
              </article>
            ))}
          </section>

          <div>
            <Link href="/project">
              <button className="button-dark">See more projects</button>
            </Link>
          </div>

          {/* Step 2: Add the AddNewProject component with props */}
          <AddNewProject
            projects={projects}
            setProjects={setProjects}
            additionalProjects={additionalProjects}
            setAdditionalProjects={setAdditionalProjects}
          />
        </section>

        <section className="about-me-section">
          <img
            src="images/musa.jpeg"
            alt="Musa Jalloh"
            className="about-me-image"
          />
          <div className="about-me-content">
            <h2 className="about-me-h2">About Me</h2>
            <p className="about-me-p">
              I am Musa Jalloh, a third-year Information Systems student at
              Østfold University College, specializing in web development and
              cybersecurity. I have gained valuable leadership experience in
              previous roles as Assistant Head Chef and Team Leader in Egon
              Restaurant. <br />
              <br /> My passion lies in software development, and I am known for
              being resourceful, hardworking, and a strong team player. During
              my time as Assistant Head Chef, I was involved in the recruitment
              process, played a key role in training new hires, and collaborated
              with the Head Chef on tasks such as stock management, invoicing,
              and scheduling.
            </p>
            <div>
              <a href="resume">
                <button className="button-light">See resume</button>
              </a>
            </div>
          </div>
        </section>
        <Skill />
      </main>

      <Footer />
    </div>
  );
}
