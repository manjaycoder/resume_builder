// components/LanguageChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useGitHubRepos, useRepoLanguages } from '../hooks/useGitHubData';
import { GitHubSkeleton } from './GitHubSkeleton';
import { useMemo } from 'react';
import ErrorBoundary from '../Components/ErrorBoundary'; // You'll need to create this

interface LanguageChartProps {
  username: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFCC00', '#A4DE6C'];

const LanguageChartContent = ({ username }: LanguageChartProps) => {
  const { 
    data: repos, 
    isLoading: reposLoading, 
    error: reposError 
  } = useGitHubRepos(username);

  // Fetch languages for each repository
  const languageQueries = useMemo(() => 
    repos?.map(repo => {
      try {
        return useRepoLanguages(username, repo.name);
      } catch (error) {
        console.error(`Error fetching languages for ${repo.name}:`, error);
        return { data: null, isLoading: false, error: error as Error };
      }
    }) || [], 
    [repos, username]
  );

  // Aggregate language data
  const chartData = useMemo(() => {
    try {
      if (!repos) return [];

      const languageData = languageQueries.reduce((acc: Record<string, number>, query) => {
        if (query.data) {
          Object.entries(query.data).forEach(([language, bytes]) => {
            acc[language] = (acc[language] || 0) + bytes;
          });
        }
        return acc;
      }, {});

      return Object.entries(languageData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, value]) => ({ name, value }));
    } catch (error) {
      console.error('Error processing language data:', error);
      return [];
    }
  }, [repos, languageQueries]);

  // Check loading states
  const languagesLoading = languageQueries.some(query => query.isLoading);
  const isLoading = reposLoading || languagesLoading;

  // Check for errors
  const languagesError = languageQueries.find(query => query.error)?.error;
  const error = reposError || languagesError;

  // Loading state
  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <GitHubSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error loading language data: {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!chartData.length) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No language data available for @{username}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Language Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} bytes`, 'Code Size']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Create this ErrorBoundary component
const LanguageChart = ({ username }: LanguageChartProps) => {
  return (
    <ErrorBoundary fallback={<div className="alert alert-error">Something went wrong with the language chart</div>}>
      <LanguageChartContent username={username} />
    </ErrorBoundary>
  );
};

export default LanguageChart;