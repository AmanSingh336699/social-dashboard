import { GitHubActivity } from "@/types/githubType";
import { FaHistory } from "react-icons/fa";


interface ActivityListProps {
  activities: GitHubActivity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
      <h2 className="text-2xl font-semibold flex items-center mb-4">
        <FaHistory className="mr-2 text-gray-600" /> Recent Activities
      </h2>
      {activities.length ? (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="border-b pb-2">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>{activity.type}</strong> - {activity.repo.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activities found.</p>
      )}
    </div>
  );
};

export default ActivityList;