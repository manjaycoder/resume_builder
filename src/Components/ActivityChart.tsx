import { useGitHubRepos } from '../hooks/useGitHubData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

interface ActivityChartProps {
  username: string;
  maxRepos?: number;
}

interface UseGitHubReposReturn {
  data: GitHubRepo[] | null;
  isLoading: boolean;
  error: Error | null;
}

interface RepoActivityData {
  name: string;
  fullName: string;
  stars: number;
  forks: number;
  issues: number;
  watchers?: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  [key: string]: any;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

export default function ActivityChart({ username, maxRepos = 5 }: ActivityChartProps) {
  const { data: repos, isLoading, error } = useGitHubRepos(username) as UseGitHubReposReturn;

  // Memoized data transformation for better performance
  const activityData: RepoActivityData[] = useMemo(() => {
    if (!repos) return [];

    // Sort by activity (stars + forks + issues) before slicing
    return [...repos]
      .sort((a, b) => {
        const aActivity = a.stargazers_count + a.forks_count + a.open_issues_count;
        const bActivity = b.stargazers_count + b.forks_count + b.open_issues_count;
        return bActivity - aActivity;
      })
      .slice(0, maxRepos)
      .map((repo) => ({
        name: repo.name.length > 12 ? `${repo.name.substring(0, 10)}...` : repo.name,
        fullName: repo.full_name,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        issues: repo.open_issues_count || 0,
        watchers: repo.watchers_count || 0,
      }));
  }, [repos, maxRepos]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload as RepoActivityData;

    return (
      <div className="p-4 bg-base-200 rounded-lg shadow-lg border border-base-300">
        <h3 className="font-bold">{data.fullName}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <span>Stars:</span>
          <span className="text-right">{data.stars.toLocaleString()}</span>
          <span>Forks:</span>
          <span className="text-right">{data.forks.toLocaleString()}</span>
          <span>Issues:</span>
          <span className="text-right">{data.issues.toLocaleString()}</span>
          <span>Watchers:</span>
          <span className="text-right">{data.watchers?.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="text-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-2">Analyzing GitHub activity for @{username}...</p>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error loading data for @{username}: {(error as Error).message}</span>
        </div>
      </div>
    );

  if (!repos?.length)
    return (
      <div className="alert alert-warning shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>No public repositories found for @{username}</span>
        </div>
      </div>
    );

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">Repository Activity</h2>
          <div className="badge badge-info">Top {Math.min(maxRepos, repos.length)}</div>
        </div>
        <p className="text-sm opacity-75">Showing most active repositories by combined metrics</p>

        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => <span className="text-sm capitalize">{value.toLowerCase()}</span>}
              />
              <Bar dataKey="stars" name="Stars" animationDuration={1500}>
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="forks" name="Forks" animationDuration={1500}>
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="issues" name="Issues" animationDuration={1500}>
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Data fetched from GitHub API. Showing combined activity metrics.</p>
          <p>Hover over bars for detailed information.</p>
        </div>
      </div>
    </div>
  );
}