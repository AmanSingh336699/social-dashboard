"use client"

import Loader from "@/components/Loader"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { FaGithub } from "react-icons/fa"
import { motion } from "framer-motion"

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const handleGithubLogin = async () => {
        setLoading(true)
        await signIn("github", { callbackUrl: "/dashboard/github" }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
            <motion.div
                className="bg-white p-10 rounded-xl shadow-lg max-w-sm w-full"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign in to Dashboard</h2>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGithubLogin}
                    className="w-full flex items-center justify-center bg-black text-white py-3 px-5 rounded-lg font-medium hover:bg-gray-800 transition duration-300 shadow-md"
                    disabled={loading}
                >
                {loading ? (
                    <Loader />
                ) : (
                    <>
                    <FaGithub className="mr-3 text-xl" />
                    <span>Sign in with GitHub</span>
                    </>
                )}
                </motion.button>
            </motion.div>
        </div>
    )
}

export default LoginPage