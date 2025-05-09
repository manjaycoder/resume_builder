import { useGitHubProfile } from '../hooks/useGitHubData';
import { GitHubSkeleton } from './GitHubSkeleton';

interface ProfileCardProps {
  username: string;
  className?: string;
}

export default function ProfileCard({ username, className = '' }: ProfileCardProps) {
  const { data, isLoading, error, isError } = useGitHubProfile(username);

  if (isLoading) {
    return (
      <div className={`card bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
        <div className="p-6">
          <GitHubSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`card bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="alert bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Error loading profile: {error?.message || 'Unknown error'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`card bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="alert bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>No profile data found for @{username}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl ${className}`}>
      {/* Header with GitHub ribbon */}
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-16 flex items-center justify-center">
        <a 
          href={data.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-2 right-2 bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
        >
          View on GitHub
        </a>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-16 mb-4">
          <a href={data.html_url} target="_blank" rel="noopener noreferrer">
            <div className="relative group">
              <img 
                src={data.avatar_url} 
                alt={`${data.login}'s avatar`}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md group-hover:ring-2 ring-indigo-400 transition-all duration-300"
              />
              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-300"></div>
            </div>
          </a>
        </div>

        {/* Name and Username */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {data.name || data.login}
          </h2>
          {data.name && (
            <p className="text-gray-500">@{data.login}</p>
          )}
        </div>

        {/* Bio */}
        {data.bio && (
          <p className="text-gray-600 text-center mb-6 px-4 py-3 bg-gray-50 rounded-lg">
            {data.bio}
          </p>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {data.company && (
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{data.company}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{data.location}</span>
            </div>
          )}
          {data.blog && (
            <a 
              href={data.blog.startsWith('http') ? data.blog : `https://${data.blog}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="truncate">{data.blog.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {data.twitter_username && (
            <a 
              href={`https://twitter.com/${data.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              <span>@{data.twitter_username}</span>
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <div className="py-3 px-2 text-center hover:bg-gray-100 transition-colors">
            <div className="text-sm font-medium text-gray-500">Followers</div>
            <div className="text-xl font-bold text-indigo-600">{data.followers}</div>
          </div>
          <div className="py-3 px-2 text-center hover:bg-gray-100 transition-colors">
            <div className="text-sm font-medium text-gray-500">Following</div>
            <div className="text-xl font-bold text-indigo-600">{data.following}</div>
          </div>
          <div className="py-3 px-2 text-center hover:bg-gray-100 transition-colors">
            <div className="text-sm font-medium text-gray-500">Repos</div>
            <div className="text-xl font-bold text-indigo-600">{data.public_repos}</div>
          </div>
        </div>
      </div>
    </div>
  );
}