"use client"

import Loader from "@/components/Loader"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { FaGithub } from "react-icons/fa"

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const handleGithubLogin = async () => {
        setLoading(true)
        await signIn("github", { callbackUrl: "/dashboard/github" }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg max-w-sm w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Sign in for DashBoard
                </h2>
                <button onClick={handleGithubLogin} className="w-full flex items-center justify-center bg-black
                 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-200" disabled={loading}>
                    {
                    loading ? <Loader /> : <>
                            <FaGithub className="mr-2" />
                            <span>Sign in with GitHub</span>
                        </>
                    }
                </button>
            </div>
        </div>
    )
}

export default LoginPage