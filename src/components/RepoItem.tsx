import { GitHubRepo } from "@/types/githubType";
import { FaStar } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { BsClockHistory, BsThreeDotsVertical, BsLockFill, BsEye } from "react-icons/bs";
import { RiGitCommitLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useCallback, useRef, useEffect, memo } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import getColorForLanguage from "@/app/utils/getColorForLanguage";
import Dustbin from "./UI/Dustbin";

const RepoItem = ({ repo, refreshRepos }: { repo: GitHubRepo, refreshRepos: () => void }) => {
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const dropDownRef = useRef<HTMLDivElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isPrivate, setIsPrivate] = useState(repo.private)
    
    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setDropDownOpen(false);
      }
    }, []);

    const renderLanguages = useCallback((languages: { language: string; percentage: number }[]) => {
        return languages.map((lang) => (
          <div key={lang.language} className="flex items-center space-x-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: getColorForLanguage(lang.language),
                width: `${lang.percentage}%`,
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">{`${lang.language} ${lang.percentage.toFixed(1)}%`}</span>
          </div>
        ));
      }, []);

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside])
    const handleDeleteRepo = async () => {
      setIsModalOpen(false)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/repos/${repo.owner.login}/${repo.name}`, {
          method: "DELETE",
          headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_BASE_ACCESS_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
          },
        })
        if(response.ok){
          toast.success("Repository deleted successfully")
          refreshRepos();
        } else {
          toast.error("Failed to delete repository. Please try again.")
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(`Error deleting repository || ${e.message}`);
        } else {
          toast.error("Error deleting repository");
        }
      }
    }

    const toggleRepoVisibility = async () => {
        setIsUpdating(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_BASE_URL}/repos/${repo.owner.login}/${repo.name}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_BASE_ACCESS_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ private: !isPrivate }),
        })

        if(response.ok){
            setIsPrivate(!isPrivate)
            toast.success(`Repository is now ${!isPrivate ? "private" : "public"}`)
        } else {
            toast.error("Failed to update repository visibility. Please try again.")
        }
      } catch (e) {
        toast.error(`Error updating repository: ${e instanceof Error ? e.message : "Unknown error"}`)
      } finally {
        setIsUpdating(false)
      }
    }
    return (
      <motion.li
        key={repo.id}
        className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col justify-between relative"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
      <div className="absolute top-2 right-2 sm:right-2 sm:top-2 md:top-2 md:right-2" ref={dropDownRef}>
        <button
          className="text-gray-700 dark:text-gray-300"
          onClick={() => setDropDownOpen(prev => !prev)}
        >
          <BsThreeDotsVertical className="text-xl" />
        </button>

      <AnimatePresence>
        {dropDownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg p-2 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            <button
              className="text-rose-600 flex items-center justify-between px-4 rounded-md py-2 w-full text-left"
              onClick={() => setIsModalOpen(true)}>
                <Dustbin />
                <span>Delete</span>
            </button>
            <button className="flex items-end text-gray-700 dark:text-gray-400 w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
             onClick={toggleRepoVisibility} disabled={isUpdating}>
                {isUpdating ? (
                    <motion.div className="rounded-full border-t-4 border-sky-500 animate-spin" style={{ height: 20, width: 20, borderWidth: 3 }} />
                ) : isPrivate ? (
                    <>
                        <BsLockFill className="mr-2 text-rose-500" />
                        (Make Public)
                    </>
                ) : (
                    <>
                        <BsLockFill className="mr-2 text-rose-500" />
                        (Make Private)
                    </>
                )}
            </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        <Link
          href={repo.html_url}
          target="_blank"
          className="text-sky-500 font-semibold text-lg truncate mb-2"
        >
          {repo.name}
      </Link>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 truncate">
        {repo.description || "No description available."}
      </p>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteRepo}
      />
      {repo.languages && repo.languages.length > 0 && (
        <div className="text-sm mb-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Languages:</h3>
          <div className="flex flex-wrap space-x-2">{renderLanguages(repo.languages)}</div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between text-gray-600 dark:text-gray-300 text-sm mb-3">
        <span className="flex items-center">
          <FaStar className="mr-1 text-yellow-400" />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center">
          <GiKnifeFork className="mr-1 text-gray-700 dark:text-gray-400" />
          {repo.forks_count}
        </span>
        <span className="flex items-center">
          <BsEye className="mr-1 text-sky-500" />
          {repo.watchers_count}
        </span>
      </div>
      <div className="flex items-center text-gray-600 dark:text-gray-300 mt-3 text-sm">
        <BsClockHistory className="mr-2 text-blue-500" />
        <span>
          Last Commit:{" "}
          {repo.last_commit !== "Unavailable" ? repo.last_commit : "Unavailable"}
        </span>
      </div>
      {repo.commit_message && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <RiGitCommitLine className="mr-2 text-2xl text-emerald-600" />
          <span className="font-medium">Commit Message: {repo.commit_message}</span>
        </div>
      )}
    </motion.li>
      )
    }

export default memo(RepoItem)