import { GitHubRepo } from "@/types/githubType";
import { BsSearch } from "react-icons/bs";
import { motion } from "framer-motion";
import { useState, useCallback, useMemo, memo } from "react";
import RepoItem from "../RepoItem";
import { useDebounce } from 'use-debounce';


interface RepoListProps {
  repos: GitHubRepo[];
  refreshRepos: () => void;
}

const RepoList: React.FC<RepoListProps> = ({ repos, refreshRepos }) => {
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
            <RepoItem key={repo.id} repo={repo} refreshRepos={refreshRepos} />
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

export default memo(RepoList);

