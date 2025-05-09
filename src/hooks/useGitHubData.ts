import { useQuery } from 'react-query';
import {
  fetchUserData,
  fetchRepos,
  fetchCommitActivity,
  fetchRepoLanguages
} from '../services/github';

export const useGitHubProfile = (username: string) => {
  return useQuery(['user', username], () => fetchUserData(username), {
    retry: 2,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

export const useGitHubRepos = (username: string) => {
  return useQuery(['repos', username], () => fetchRepos(username), {
    select: (repos) => repos.sort((a, b) => b.stargazers_count - a.stargazers_count),
    enabled: !!username,
    retry: 2
  });
};

export const useRepoLanguages = (username: string, repo: string) => {
  return useQuery(
    ['languages', username, repo],
    () => fetchRepoLanguages(username, repo),
    {
      enabled: !!username && !!repo,
      retry: 2
    }
  );
};

export const useCommitActivity = (username: string, repo: string) => {
  return useQuery(
    ['commits', username, repo],
    () => fetchCommitActivity(username, repo),
    {
      enabled: !!username && !!repo,
      retry: 2
    }
  );
};