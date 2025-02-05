import { BsPerson } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion";
import { GitHubProfile } from "@/types/githubType";
import { memo } from "react";

interface ProfileSectionProps {
  profile: GitHubProfile;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 max-w-4xl mx-auto"
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
      <img
        src={profile?.avatar_url}
        alt="Avatar"
        className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg"
      />

      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {profile?.login}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-2">
          {profile?.bio || "No bio available"}
        </p>

        <div className="flex justify-center md:justify-start space-x-6 text-gray-600 dark:text-gray-400 mt-4">
          <span className="flex items-center text-sm md:text-base">
            <BsPerson className="mr-1 text-lg" />
            Followers: {profile?.followers}
          </span>
          <span className="flex items-center text-sm md:text-base">
            <FaUserFriends className="mr-1 text-lg" />
            Following: {profile?.following}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default memo(ProfileSection);