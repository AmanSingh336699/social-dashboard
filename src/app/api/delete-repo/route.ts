import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { repoName, accessToken, username } = await req.json();

        if (!repoName || !accessToken || !username) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const GITHUB_API_URL = process.env.GITHUB_BASE_URL || "https://api.github.com";

        const userResponse = await fetch(`${GITHUB_API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!userResponse.ok) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
        }

        const user = await userResponse.json();

        const repoResponse = await fetch(`${GITHUB_API_URL}/repos/${username}/${repoName}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!repoResponse.ok) {
            return NextResponse.json({ error: "Repository not found or unauthorized access" }, { status: repoResponse.status });
        }

        const repo = await repoResponse.json();

        if (repo.owner.login !== username) {
            return NextResponse.json({ error: "You are not the owner of this repository" }, { status: 403 });
        }

        const deleteResponse = await fetch(`${GITHUB_API_URL}/repos/${username}/${repoName}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (deleteResponse.status === 204) {
            return NextResponse.json({ message: "Repository deleted successfully" });
        } 
        
        const errorText = await deleteResponse.text();
        try {
            const errorJson = JSON.parse(errorText);
            return NextResponse.json({ error: errorJson }, { status: deleteResponse.status });
        } catch {
            return NextResponse.json({ error: errorText || "An unknown error occurred" }, { status: deleteResponse.status });
        }

    } catch (error) {
        console.error("Error deleting repository:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
