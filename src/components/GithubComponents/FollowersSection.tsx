import { GitHubFollower } from "@/types/githubType";
import { FaUserFriends, FaSearch } from "react-icons/fa";
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import React, { useState, memo } from "react";

interface FollowersSectionProps {
  followers: GitHubFollower[];
  following: GitHubFollower[];
}

const ITEMS_PER_PAGE = 6;

const FollowersSection: React.FC<FollowersSectionProps> = ({ followers, following }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredType, setHoveredType] = useState<"followers" | "following" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const x = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 5 };
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement, MouseEvent>, index: number, type: "followers" | "following") => {
    const halfWidth = (event.target as HTMLImageElement).offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
    setHoveredIndex(index);
    setHoveredType(type);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setHoveredType(null)
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredFollowers = followers.filter((user) =>
    user.login.toLowerCase().includes(searchQuery)
  );
  const filteredFollowing = following.filter((user) =>
    user.login.toLowerCase().includes(searchQuery)
  );

  const paginatedFollowers = filteredFollowers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const paginatedFollowing = filteredFollowing.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.05 },
  };

  const renderList = (users: GitHubFollower[], type: "followers" | "following") => (
    <motion.div>
      <motion.h2
        className="text-lg md:text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaUserFriends className="mr-2 text-gray-600 dark:text-gray-300" /> {type === "followers" ? "Followers" : "Following"}
      </motion.h2>
      {users.length ? (
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {users.map((user, index) => (
            <motion.li
              key={user.id}
              className="relative flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all hover:shadow-lg"
              variants={itemVariants}
              whileHover="hover"
              onMouseLeave={handleMouseLeave}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {hoveredIndex === index && hoveredType === type && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 260, damping: 10 },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                    style={{
                      translateX: translateX,
                      rotate: rotate,
                      whiteSpace: "nowrap",
                    }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
                  >
                    <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                    <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                    <div className="font-bold text-white relative z-30 text-base">
                      {user.login}
                    </div>
                    <div className="text-white text-xs">{type === "followers" ? "Follower" : "Following"}</div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Image
                onMouseMove={(e) => handleMouseMove(e, index, type)}
                height={100}
                width={100}
                src={user.avatar_url}
                alt={user.login}
                className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
              />
              <div className="ml-4">
                <Link
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  className="text-sm md:text-base text-sky-500 hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm md:text-base text-gray-600 dark:text-gray-300"
        >
          No {type === "followers" ? "followers" : "following"} found.
        </motion.p>
      )}
      <div className="mt-4 flex justify-center space-x-4">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg">
            Previous
          </button>
        )}
        {users.length > currentPage * ITEMS_PER_PAGE && (
          <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg">
            Next
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="bg-gray-50 dark:bg-gray-900 shadow-md rounded-md p-6 space-y-8 md:max-w-4xl lg:max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <button
            onClick={handleSearchToggle}
            className="p-2 bg-gray-800 text-white rounded-md"
          >
            <FaSearch />
          </button>
          {isSearchVisible && (
            <motion.input
              type="text"
              placeholder="Search users..."
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none text-black"
              onChange={handleSearchChange}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </div>
      {renderList(paginatedFollowers, "followers")}
      {renderList(paginatedFollowing, "following")}
    </motion.div>
  );
};

export default memo(FollowersSection);