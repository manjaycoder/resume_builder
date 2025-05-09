
interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  size: number;
  archived: boolean;
  disabled: boolean;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  topics: string[];
}

interface CommitActivity {
  days: number[];
  total: number;
  week: number;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

interface ApiError extends Error {
  status?: number;
  headers?: Headers;
  data?: any;
}

class GitHubApiError extends Error {
  status: number;
  headers: Headers;
  data: any;

  constructor(message: string, status: number, headers: Headers, data: any) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.headers = headers;
    this.data = data;
  }
}

const API_URL = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const getRateLimitInfo = (headers: Headers): RateLimitInfo => {
  return {
    limit: parseInt(headers.get('X-RateLimit-Limit') || '0'),
    remaining: parseInt(headers.get('X-RateLimit-Remaining') || '0'),
    reset: parseInt(headers.get('X-RateLimit-Reset') || '0'),
    used: parseInt(headers.get('X-RateLimit-Used') || '0'),
  };
};

const checkRateLimit = (rateLimit: RateLimitInfo): void => {
  if (rateLimit.remaining < 10) {
    const resetTime = new Date(rateLimit.reset * 1000);
    console.warn(
      `GitHub API rate limit warning: ${rateLimit.remaining}/${rateLimit.limit} remaining. Resets at ${resetTime.toLocaleString()}`
    );
  }
};

const fetchGitHubData = async <T>(url: string): Promise<T> => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(url, { headers });

    const rateLimit = getRateLimitInfo(response.headers);
    checkRateLimit(rateLimit);

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new GitHubApiError(
        errorData.message || `GitHub API request failed with status ${response.status}`,
        response.status,
        response.headers,
        errorData
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw error;
    }
    throw new GitHubApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0,
      new Headers(),
      null
    );
  }
};

export const fetchUserData = async (username: string): Promise<GitHubUser> => {
  return fetchGitHubData<GitHubUser>(`${API_URL}/users/${username}`);
};

export const fetchRepos = async (
  username: string,
  options: {
    per_page?: number;
    page?: number;
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    type?: 'all' | 'owner' | 'member';
  } = {}
): Promise<GitHubRepo[]> => {
  const {
    per_page = 100,
    page = 1,
    sort = 'updated',
    direction = 'desc',
    type = 'owner',
  } = options;

  const params = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
    sort,
    direction,
    type,
  });

  return fetchGitHubData<GitHubRepo[]>(
    `${API_URL}/users/${username}/repos?${params.toString()}`
  );
};

export const fetchRepo = async (
  username: string,
  repo: string
): Promise<GitHubRepo> => {
  return fetchGitHubData<GitHubRepo>(`${API_URL}/repos/${username}/${repo}`);
};

export const fetchCommitActivity = async (
  username: string,
  repo: string
): Promise<CommitActivity[]> => {
  return fetchGitHubData<CommitActivity[]>(
    `${API_URL}/repos/${username}/${repo}/stats/commit_activity`
  );
};

export const fetchRepoLanguages = async (
  username: string,
  repo: string
): Promise<Record<string, number>> => {
  return fetchGitHubData<Record<string, number>>(
    `${API_URL}/repos/${username}/${repo}/languages`
  );
};

export const fetchContributors = async (
  username: string,
  repo: string
): Promise<GitHubUser[]> => {
  return fetchGitHubData<GitHubUser[]>(
    `${API_URL}/repos/${username}/${repo}/contributors`
  );
};

export const fetchRateLimit = async (): Promise<RateLimitInfo> => {
  const response = await fetch(`${API_URL}/rate_limit`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
    },
  });
  const data = await response.json();
  return data.rate || data.resources.core;
};







// ////////////////////////
// <div className="lg:col-span-2 space-y-6">
// <div className="bg-white rounded-xl shadow-md p-6">
//   <h3 className="text-lg font-semibold mb-4">Code Language Distribution</h3>
//   <LanguageChart username={username} />
// </div>

// <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//   <div className="bg-white rounded-xl shadow-md p-6">
//     <h3 className="text-lg font-semibold mb-4">Repository Stats</h3>
//     <StatsGrid username={username} />
//   </div>
//   <div className="bg-white rounded-xl shadow-md p-6">
//     <h3 className="text-lg font-semibold mb-4">Generated Resume</h3>
//     <ResumeOutput username={username} />
//   </div>
// </div>
// </div>