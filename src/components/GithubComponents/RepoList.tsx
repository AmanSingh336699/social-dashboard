import { GitHubRepo } from "@/types/githubType";
import { FaStar } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { BsClockHistory, BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { RiGitCommitLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useDebounce } from 'use-debounce';
import toast from "react-hot-toast";

interface RepoListProps {
  repos: GitHubRepo[];
  accessToken: string;
  refreshRepos: () => void;
}

const RepoList: React.FC<RepoListProps> = ({ repos, accessToken, refreshRepos }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reposPerPage] = useState(6);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300); 
  

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) =>
      repo.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [repos, debouncedSearchQuery]);

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = useMemo(() => {
    return Math.ceil(filteredRepos.length / reposPerPage);
  }, [filteredRepos, reposPerPage])


  const handleSearchClick = useCallback(() => {
    setIsSearchVisible(prev => !prev)
  },[]);

  type SearchChangeEvent = React.ChangeEvent<HTMLInputElement>

  const handleSearchChange = useCallback((event: SearchChangeEvent) => {
    setSearchQuery(event.target.value);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
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

  const getColorForLanguage = (language: string) => {
    switch (language.toLowerCase()) {
      case "javascript":
        return "#f1e05a";
      case "python":
        return "#3572A5";
      case "html":
        return "#e34c26";
      case "css":
        return "#563d7c";
      case "java":
        return "#b07219";
      case "typescript":
        return "#2b7489";
      default:
        return "#000000";
    }
  };

  const RepoItem = ({ repo }: { repo: GitHubRepo }) => {
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const dropDownRef = useRef(null)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropDownRef.current && !(dropDownRef.current as HTMLElement).contains(event.target as Node)) {
        setDropDownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [])
    const handleDeleteRepo = async () => {
      const confirmDelete = confirm(`Are you sure you want to delete the repository: ${repo.name}?`) //new
      if(!confirmDelete) return //new
  
      try {
        const response = await fetch("/api/delete-repo", {
          method: "DELETE",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            repoName: repo.name,
            accessToken,
            username: repo.owner.login
          })
        })
        if(response.ok){
          toast.success("Repository deleted successfully")
          refreshRepos();
        } else {
          toast.error("Failed to delete repository. Please try again.")
        }
      } catch (e: any) {
        toast.error(`Error deleting repository || ${e.message}`)
      }
    }
    return (
        <motion.li
          key={repo.id}
          className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col justify-between"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-2 right-2" ref={dropDownRef}>
            <button className="text-gray-600 dark:text-gray-300" onClick={() => setDropDownOpen(prev => !prev)}>
              <BsThreeDotsVertical className="text-xl" />
            </button>
            <AnimatePresence>
              {dropDownOpen && (
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.95}}
                 animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} 
                 transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg p-2 rounded-lg border border-gray-300 dark:border-gray-600">
                  <button className="text-rose-600 px-4 py-2 block w-full text-left hover:bg-rose-50 dark:hover:bg-rose-700"
                    onClick={handleDeleteRepo}>
                    Delete Repo
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
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300 mt-3 text-sm">
            <BsClockHistory className="mr-2 text-blue-500" />
            <span>
              Last Commit:{" "}
              {repo.last_commit !== "Unavailable"
                ? repo.last_commit
                : "Unavailable"}
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
  RepoList.displayName = "RepoList"

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 max-w-6xl mx-auto"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Repositories</h2>
      </div>
      <div className="flex gap-2 mb-4">
        <BsSearch
          onClick={handleSearchClick}
          className="text-xl text-gray-600 dark:text-gray-300 cursor-pointer"
        />
        <motion.input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Repositories"
          className={`w-full max-w-md p-2 mt-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-all duration-300 ${
            isSearchVisible
              ? "opacity-100 scale-100 translate-x-0"
              : "opacity-0 scale-0 -translate-x-full"
          }`}
          style={{ transition: "transform 0.3s, opacity 0.3s" }}
        />
      </div>
      {currentRepos.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {currentRepos.map((repo) => (
            <RepoItem key={repo.id} repo={repo} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">No repositories found.</p>
      )}
      {filteredRepos.length > reposPerPage && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-600"
          >
            Previous
          </button>
          <span className="self-center text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

RepoList.displayName = "RepoList"

export default RepoList;

