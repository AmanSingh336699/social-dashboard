import { GitHubRepo } from "@/types/githubType";
import { FaStar } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { BsClockHistory, BsSearch } from "react-icons/bs";
import { motion } from "framer-motion";
import Link from "next/link";
import { memo, useState } from "react";

interface RepoListProps {
  repos: GitHubRepo[];
}

const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reposPerPage] = useState(6);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo);

  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);

  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible)
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderLanguages = (languages: { language: string; percentage: number }[]) => {
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
  };

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

      {currentRepos && currentRepos.length ? (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {currentRepos.map((repo) => (
            <motion.li
              key={repo.id}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col justify-between"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
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
                    ? new Date(repo.last_commit).toLocaleDateString()
                    : "Unavailable"}
                </span>
              </div>
            </motion.li>
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

export default memo(RepoList);