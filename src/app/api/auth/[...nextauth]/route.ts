import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async jwt({ token, account}){
            if(account){
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }){
            if(token?.accessToken){
                session.accessToken = token.accessToken
            }
            return session
        },
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/auth/signin"
    },
    secret: process.env.NEXT_SECRET_TOKEN
})
export { handler as GET, handler as POST }