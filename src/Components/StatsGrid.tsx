import { useGitHubProfile } from '../hooks/useGitHubData'

interface StatsGridProps {
  username: string
}

// Define complete type for GitHub profile stats
interface GitHubProfileStats {
  public_repos?: number
  followers?: number
  following?: number
  public_gists?: number
  [key: string]: any // Catch-all for other potential properties
}

export default function StatsGrid({ username }: StatsGridProps) {
  // Explicitly type the hook response
  const { data: profile, isLoading, error } = useGitHubProfile(username) as {
    data: GitHubProfileStats | null
    isLoading: boolean
    error: Error | null
  }

  // Memoized stats data with fallbacks
  const stats = [
    { title: 'Public Repos', value: profile?.public_repos ?? 0 },
    { title: 'Followers', value: profile?.followers ?? 0 },
    { title: 'Following', value: profile?.following ?? 0 },
    { title: 'Gists', value: profile?.public_gists ?? 0 }
  ]

  // Loading state
  if (isLoading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card bg-base-100 shadow animate-pulse">
          <div className="card-body p-4 text-center">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  )

  // Error state
  if (error) return (
    <div className="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error loading stats: {(error as Error).message}</span>
    </div>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {stats.map((stat, index) => (
        <div key={index} className="card bg-base-100 shadow hover:shadow-md transition-shadow">
          <div className="card-body p-4 text-center">
            <h3 className="text-sm font-semibold text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold">
              {stat.value.toLocaleString()} {/* Format numbers with commas */}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}