"use client"

import { createRepo } from "@/app/utils/githubApi";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import {motion} from "framer-motion"
import { AiOutlineCloudUpload } from "react-icons/ai";
import Loader from "../Loader";

interface AddRepoProps {
	refreshRepos: () => void;
}

const AddRepo = ({ refreshRepos }: AddRepoProps) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = await createRepo(name, description, isPrivate)
            if(data && data.name){
                toast.success(`Repository ${data.name} created successfully`)
                refreshRepos()
                setName("")
                setDescription("")
                setIsPrivate(false)
            }
        } catch (error) {
            toast.error("Failed to create repository")
        }
        setLoading(false)
    }

    return (
        <motion.div className="bg-white dark:bg-gray-700 shadow-md p-4 rounded-md"
         initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}>
            <h2 className="text-lg font-bold mb-2 flex items-center">
                <AiOutlineCloudUpload className="mr-2 text-sky-500" />
                Create New Repository
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder="Repository name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full text-gray-900 rounded-md focus:outline-none" required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full text-gray-900 rounded-md focus:outline-none" required />
                <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                    <span>Private Repository</span>
                </label>
                <button type="submit" disabled={loading} className="bg-sky-500 text-white p-2 w-full rounded-md hover:bg-sky-700 transition">
                    {loading ? <Loader size={20} button /> : "Create Repository"}
                </button>
            </form>
        </motion.div>
    )
}

export default memo(AddRepo);