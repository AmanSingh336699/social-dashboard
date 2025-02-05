"use client"

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchUserFollowers, fetchUserProfile, fetchUserRepo, fetchRepoLanguages, fetchUserRecentActivity, fetchUserFollowing } from "@/app/utils/githubApi";
import { GitHubProfile, GitHubRepo, GitHubFollower, GitHubActivity } from "@/types/githubType";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import dynamic from "next/dynamic";
const ProfileSection = dynamic(() => import("@/components/GithubComponents/Profile"), {
  ssr: false
})
const RepoList = dynamic(() => import("@/components/GithubComponents/RepoList"), {
  ssr: false
})
const  ActivityList = dynamic(() => import("@/components/GithubComponents/ActivityList"), {
  ssr: false
})
const LanguageChart = dynamic(() => import("@/components/GithubComponents/LanguageChart"), {
  ssr: false
})
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import AddRepo from "@/components/GithubComponents/AddRepo";
import Add from "@/components/UI/Add";
const FollowersSection = dynamic(() => import("@/components/GithubComponents/FollowersSection"), {
  ssr: false
})


const GitHubDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAddRepo, setShowAddRepo] = useState(false)
  const token = session?.accessToken as string;
  const username = session?.user?.name as string;

  const { data: profile, isLoading: profileLoading, isError: profileError } = useQuery<GitHubProfile>({
    queryKey: ["githubProfile", username],
    queryFn: () => fetchUserProfile(username, token),
    enabled: !!username && !!token,
  });

  const { data: repos, isLoading: reposLoading, refetch: refreshRepos } = useQuery<GitHubRepo[]>({
    queryKey: ["githubRepo", username],
    queryFn: () => fetchUserRepo(username),
    enabled: !!username && !!token
  });

  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["githubLanguages", username],
    queryFn: async () => {
      if (!repos) return {};
      return await fetchRepoLanguages(repos, token);
    },
    enabled: !!repos && !!token,
  });

  const { data: followers, isLoading: followersLoading } = useQuery<GitHubFollower[]>({
    queryKey: ["githubFollowers", username],
    queryFn: () => fetchUserFollowers(username, token),
    enabled: !!username && !!token,
  });

  const { data: activities, isLoading: activityLoading } = useQuery<GitHubActivity[]>({
    queryKey: ["githubActivity", username],
    queryFn: () => fetchUserRecentActivity(username, token),
    enabled: !!username && !!token,
  });


  const { data: following, isLoading: followingLoading } = useQuery<GitHubFollower[]>({
    queryKey: ["following", username],
    queryFn: () => fetchUserFollowing(username, token),
    enabled: !!username && !!token,
  })

  useEffect(() => {
    if(status === "unauthenticated"){
        router.push("/auth/signin")
    }
    },[status, router])
  
    if(status === "loading"){
      return <Loader />
    }

  if (profileLoading || reposLoading ||
     languagesLoading || activityLoading
     || followersLoading || followingLoading) return <Loader />;

  if (profileError) return <Error message="Failed to fetch profile." />;
  if (!profile) return <Error message="Profile not found." />;

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <ProfileSection profile={profile} />
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Repositories</h2>
        <button onClick={() => setShowAddRepo(prev => !prev)} className="flex items-center px-4 py-2 rounded-md text-white hover:bg-sky-700 bg-sky-500 transition">
          <Add />
          <span>{showAddRepo ? "Close" : "Add Repo"}</span>
        </button>
      </div>
      {showAddRepo && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          <AddRepo refreshRepos={refreshRepos} />
        </motion.div>
      )}
      {<RepoList repos={repos || []} refreshRepos={refreshRepos} />}
      {languages && <LanguageChart languages={languages} />}
      <ActivityList activities={activities || []} />
      {followers && following && <FollowersSection followers={followers} following={following} />}
      <Toaster />
    </motion.div>
  );
};

export default GitHubDashboard;






















