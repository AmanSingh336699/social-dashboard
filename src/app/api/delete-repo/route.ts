import { NextResponse } from "next/server"

export async function DELETE(req: Request){
    const { repoName, accessToken, username } = await req.json()

    if(!repoName || !accessToken){
        return NextResponse.json({ error: "Missing Data" }, { status: 404 })
    }

    const response = await fetch(`${process.env.GITHUB_BASE_URL}/repos/${username}/${repoName}`, {
        method: "DELETE",
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        }
    })

    if(response.status === 204){
        return NextResponse.json({ message: "Repo deleted successfully"})
    } else {
        const errorData = await response.json()
        return NextResponse.json({ error: errorData }, { status: response.status })
    }
}