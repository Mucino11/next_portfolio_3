export default function Skill() {
  return (
    <section className="my-skills-section">
      <h2 className="skill-section-h2">Technologies & Skills</h2>

      <div className="skill-group">
        <h3>Web Development</h3>
        <div className="skill-item">
          <h4>React & Next.js</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "75%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>JavaScript</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "72%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>HTML & CSS</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "89%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>Node.js</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "60%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>SQL & NoSQL</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "70%" }}></div>
          </div>
        </div>
      </div>

      <div className="skill-group">
        <h3>Web Design</h3>
        <div className="skill-item">
          <h4>UI/UX Design</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "87%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>Adobe XD</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "80%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>WordPress & Webflow</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "80%" }}></div>
          </div>
        </div>
      </div>

      <div className="skill-group">
        <h3>Media Production</h3>
        <div className="skill-item">
          <h4>Photography & Videography</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "80%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>Video Editing</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "70%" }}></div>
          </div>
        </div>
        <div className="skill-item">
          <h4>Adobe Lightroom & Photoshop</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
