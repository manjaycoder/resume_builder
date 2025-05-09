import { Link } from 'react-router-dom'
import githubLogo from '../assets/github-logo.svg'

export default function Header() {
  return (
    <header className="bg-base-300 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={githubLogo} alt="GitHub Logo" className="h-8" />
          <span className="text-xl font-bold">GitHub Profile Analyzer</span>
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}