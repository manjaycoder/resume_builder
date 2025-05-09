import { useGitHubProfile, useGitHubRepos } from '../hooks/useGitHubData'
import html2pdf from 'html2pdf.js'
import { useMemo } from 'react'

interface ResumeOutputProps {
  username: string
}

interface GitHubProfile {
  login: string
  name?: string | null
  bio?: string | null
  location?: string | null
  blog?: string | null
  avatar_url: string
  [key: string]: any
}

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  [key: string]: any
}

export default function ResumeOutput({ username }: ResumeOutputProps) {
  const { data: profile, isLoading: profileLoading, error: profileError } = useGitHubProfile(username)
  const { data: repos, isLoading: reposLoading, error: reposError } = useGitHubRepos(username)

  const topLanguages = useMemo(() => {
    if (!repos) return []
    const languages = repos.reduce((acc: Record<string, number>, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1
      }
      return acc
    }, {})
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language]) => language)
  }, [repos])

  const handleDownload = () => {
    setTimeout(() => {
      const element = document.getElementById('resume-content')
      if (!element) return
      const opt = {
        margin: 10,
        filename: `${username}-github-resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }
      html2pdf().from(element).set(opt).save()
    }, 100) // slight delay ensures DOM rendering
  }

  if (profileLoading || reposLoading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
      <span className="ml-2">Building your resume...</span>
    </div>
  )

  if (profileError || reposError) return (
    <div className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error: {profileError?.message || reposError?.message || "Something went wrong while fetching data."}</span>
    </div>
  )

  if (!profile || !repos) return (
    <div className="alert alert-warning">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>No profile or repository data found</span>
    </div>
  )

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body p-0">
        {/* PDF Content */}
        <div id="resume-content" className="p-8 bg-white">
          {/* Header: Google-style simplicity with bold typography */}
          <header className="mb-8 border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {profile.name || profile.login}
                </h1>
                <p className="text-xl text-gray-600 mt-1">
                  {profile.bio || "Software Engineer"}
                </p>
              </div>
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-gray-200"
                />
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-gray-700">
              {profile.location && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </span>
              )}
              {profile.blog && profile.blog.trim() && (
                <a 
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center link link-primary"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {profile.blog.replace(/^https?:\/\//, '')}
                </a>
              )}
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center link link-primary"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                github.com/{username}
              </a>
            </div>
          </header>

          {/* Skills: Clean, compact badges */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {topLanguages.map(language => (
                <span 
                  key={language} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {language}
                </span>
              ))}
            </div>
          </section>

          {/* Projects: Show only top repos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Top Projects</h2>
            <ul className="space-y-4">
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5)
                .map(repo => (
                  <li key={repo.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900">{repo.name}</h3>
                    <p className="text-gray-700">{repo.description || "No description"}</p>
                    <div className="flex mt-2">
                      <span className="mr-4">
                        ⭐ {repo.stargazers_count}
                      </span>
                      <span>
                        🍴 {repo.forks_count}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        </div>

        {/* Download Button */}
        <div className="card-actions justify-center py-4">
          <button onClick={handleDownload} className="btn btn-primary">Download Resume</button>
        </div>
      </div>
    </div>
  )
}
