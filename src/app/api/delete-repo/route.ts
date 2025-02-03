// import { NextResponse } from "next/server";

// export async function DELETE(req: Request) {
//     try {
//         const { repoName, accessToken, username } = await req.json();

//         if (!repoName || !accessToken || !username) {
//             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//         }

//         const GITHUB_API_URL = process.env.GITHUB_BASE_URL || "https://api.github.com";

//         const response = await fetch(`${GITHUB_API_URL}/repos/${username}/${repoName}`, {
//             method: "DELETE",
//             headers: {
//                 Authorization: `token ${accessToken}`,
//                 Accept: "application/vnd.github.v3+json",
//             },
//         });

//         if (response.status === 204) {
//             return NextResponse.json({ message: "Repository deleted successfully" });
//         } 
        
//         const errorText = await response.text();
//         try {
//             const errorJson = JSON.parse(errorText);
//             return NextResponse.json({ error: errorJson }, { status: response.status });
//         } catch {
//             return NextResponse.json({ error: errorText || "An unknown error occurred" }, { status: response.status });
//         }

//     } catch (error) {
//         console.error("Error deleting repository:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { repoName, accessToken, username } = await req.json();

        if (!repoName || !accessToken || !username) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const GITHUB_API_URL = process.env.GITHUB_BASE_URL || "https://api.github.com";

        // Validate token
        const userResponse = await fetch(`${GITHUB_API_URL}/user`, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });
        const user = await userResponse.json();
        if (!user.login) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
        }

        // Validate repo ownership
        const repoResponse = await fetch(`${GITHUB_API_URL}/repos/${username}/${repoName}`, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });
        
        if (repoResponse.status === 404) {
            return NextResponse.json({ error: "Repository not found" }, { status: 404 });
        }

        const repo = await repoResponse.json();
        if (repo.owner.login !== username) {
            return NextResponse.json({ error: "You are not the owner of this repository" }, { status: 403 });
        }

        // Proceed with delete request
        const response = await fetch(`${GITHUB_API_URL}/repos/${username}/${repoName}`, {
            method: "DELETE",
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (response.status === 204) {
            return NextResponse.json({ message: "Repository deleted successfully" });
        } 

        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            return NextResponse.json({ error: errorJson }, { status: response.status });
        } catch {
            return NextResponse.json({ error: errorText || "An unknown error occurred" }, { status: response.status });
        }

    } catch (error) {
        console.error("Error deleting repository:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
