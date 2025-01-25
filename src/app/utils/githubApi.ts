import { GitHubActivity, GitHubFollower, GitHubProfile, GitHubRepo } from "../../types/githubType";

export const fetchUserProfile = async (username: string, token: string): Promise<GitHubProfile> =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error("Failed to fetch user profile")
    }
    return await response.json()
}

export const fetchUserRepo = async (username: string, token: string): Promise<GitHubRepo[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch user repositories");
    }
  
    const repos = await response.json();
  
    const reposWithCommitsAndLanguages = await Promise.all(
      repos.map(async (repo: any) => {
        if (!repo.commits_url) {
          return { ...repo, last_commit: "Unavailable", languages: [] };
        }
  
        const commitUrl = repo.commits_url.replace("{/sha}", "");
        const commitsResponse = await fetch(commitUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        let languages: { language: string; percentage: number }[] = [];
        const languagesResponse = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/repos/${username}/${repo.name}/languages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (languagesResponse.ok) {
          const languageData = await languagesResponse.json();
          const totalLines: number = (Object.values(languageData) as number[]).reduce((sum, value) => sum + value, 0);
          languages = Object.entries(languageData).map(([language, lines]) => ({
            language,
            percentage: (lines as number / totalLines) * 100
          }));
        }
  
        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          return {
            ...repo,
            last_commit: commits[0]?.commit?.committer?.date || "Unavailable",
            languages,
          };
        } else {
          return { ...repo, last_commit: "Unavailable", languages };
        }
      })
    );
  
    return reposWithCommitsAndLanguages;
  };

export const fetchRepoLanguages = async (repos: GitHubRepo[], token: string) => {
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

        const repoLanguages: { [key: string]: number } = await response.json()
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
    return await response.json()
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
    return await response.json()
}

export const fetchUserRecentActivity = async (username: string, token: string): Promise<GitHubActivity[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/users/${username}/events`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("Failed to fetch user activity")
    }

    return await response.json()
}