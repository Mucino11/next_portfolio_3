import Link from "next/link";

export default function Footer() {
  return (
    <nav className="navigation-bar">
      <ul className="nav-list">
        <li>
          <Link href="/">Musa Jalloh</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/project">Project</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/resume">Resume</Link>
        </li>
      </ul>
    </nav>
  );
}
