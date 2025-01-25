import { GitHubActivity, GitHubFollower, GitHubProfile, GitHubRepo, Language, GitHubLanguage } from "../../types/githubType";

interface Commit {
  commit: {
    committer: {
      date: string;
    };
    message: string;
  };
}

interface RepoCommit extends GitHubRepo {
  last_commit: string;
  commit_message: string;
  languages: { language: string; percentage: number }[];
}


export const fetchUserProfile = async (username: string, token: string): Promise<GitHubProfile> =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error("Failed to fetch user profile")
    }
    return await response.json() as GitHubProfile
}

export const fetchUserRepo = async (username: string, token: string): Promise<RepoCommit[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}/repos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user repositories");
  }

  const repos = await response.json() as GitHubRepo[];

  const reposWithCommitsAndLanguages = await Promise.all(
    repos.map(async (repo: GitHubRepo) => {
      if (!repo.commits_url) {
        return { ...repo, last_commit: "Unavailable", languages: [], commit_message: "Unavailable" };
      }

      const commitUrl = repo.commits_url.replace("{/sha}", "");
      const commitsResponse = await fetch(commitUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let languages: { language: string; percentage: number }[] = [];
      const languagesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/repos/${username}/${repo.name}/languages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (languagesResponse.ok) {
        const languageData = await languagesResponse.json() as GitHubLanguage;
        const totalLines: number = (Object.values(languageData) as number[]).reduce(
          (sum, value) => sum + value,
          0
        );
        languages = Object.entries(languageData).map(([language, lines]) => ({
          language,
          percentage: (lines as number / totalLines) * 100,
        }));
      }

      let last_commit = "Unavailable";
      let commit_message = "Unavailable";
      if (commitsResponse.ok) {
        const commits = await commitsResponse.json() as Commit[];
        const lastCommit = commits[0]
        
        if (lastCommit) {
          const commitDate = lastCommit.commit.committer.date;
          const formattedDate = new Date(commitDate);
          last_commit = `${formattedDate.toLocaleDateString()} at ${formattedDate.toLocaleTimeString()}`;

          commit_message = lastCommit.commit.message;
        }
      }
      
      return {
        ...repo,
        last_commit,
        commit_message, 
        languages,
      };
    })
  );

  return reposWithCommitsAndLanguages as RepoCommit[];
};


export const fetchRepoLanguages = async (repos: GitHubRepo[], token: string): Promise<{ [key: string]: number }> => {
    const languages: { [key: string]: number } = {}
    for(const repo of repos){
        const response = await fetch(repo.languages_url, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if(!response.ok){
            throw new Error("Failed to fetch repo languages")
        }

        const repoLanguages = await response.json() as { [key: string]: number }
        Object.entries(repoLanguages).forEach(([language, bytes]) => {
            languages[language] = (languages[language] || 0) + bytes
        })
    }
    return languages
}

export const fetchUserFollowers = async (username: string, token: string): Promise<GitHubFollower[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}/followers`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error("Failed to fetch user profile")
    }
    return await response.json() as GitHubFollower[]
}

export const fetchUserFollowing = async (username: string, token: string): Promise<GitHubFollower[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}/following`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error("Failed to fetch user profile")
    }
    return await response.json() as GitHubFollower[]
}

export const fetchUserRecentActivity = async (username: string, token: string): Promise<GitHubActivity[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}/events/public?per_page=5`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("Failed to fetch user activity")
    }
    const events = await response.json() as GitHubActivity[]
    return events
}