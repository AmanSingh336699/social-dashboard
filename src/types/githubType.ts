export interface GitHubProfile {
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    followers: number;
    following: number;
}

export interface GitHubRepo {
    id: number;
    name: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    last_commit: string;
    languages_url: string;
    description: string;
    languages: string[];
}

export interface GitHubFollower {
    id: number;
    login: string;
    avatar_url: string;
}

export interface GitHubActivity {
    id: string;
    type: string;
    repo: {
        name: string;
        url: string;
    };
    actor: {
        login: string;
        avatar_url: string;
    };
    created_at: string;
}
