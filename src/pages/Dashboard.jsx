import { useAuth } from '../contexts/AuthContext';
import { useDashboard, useUserStats } from '../hooks/useData';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboard();
  const { data: statsData, isLoading: isStatsLoading } = useUserStats();

  const isLoading = isDashboardLoading || isStatsLoading;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-primary-100">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Notifications"
            value={dashboardData?.data?.notifications || 0}
            icon="🔔"
            color="bg-blue-500"
          />
          <StatCard
            title="Messages"
            value={dashboardData?.data?.messages || 0}
            icon="💬"
            color="bg-green-500"
          />
          <StatCard
            title="Tasks"
            value={dashboardData?.data?.tasks || 0}
            icon="✓"
            color="bg-purple-500"
          />
          <StatCard
            title="Projects"
            value={dashboardData?.data?.projects || 0}
            icon="📁"
            color="bg-orange-500"
          />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Recent Activity
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData?.recentActivity?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-2 h-2 mt-2 bg-primary-500 rounded-full"></div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📈</span>
            Account Statistics
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <StatRow label="Total Logins" value={statsData?.totalLogins || 0} />
              <StatRow label="Account Age (days)" value={statsData?.accountAge || 0} />
              <StatRow
                label="Last Login"
                value={new Date(statsData?.lastLogin).toLocaleDateString()}
              />
              <StatRow label="Active Sessions" value={statsData?.activeSessionsCount || 0} />
            </div>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">👤</span>
          User Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Email" value={user?.email} />
          <InfoItem label="Role" value={user?.role} />
          <InfoItem label="User ID" value={`#${user?.id}`} />
          <InfoItem
            label="Token Status"
            value={
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
        {icon}
      </div>
    </div>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value}</p>
  </div>
);

export default Dashboard;
