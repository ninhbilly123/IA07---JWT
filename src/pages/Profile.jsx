import { useAuth } from '../contexts/AuthContext';
import { useUserStats } from '../hooks/useData';
import { tokenManager } from '../api/axios';

const Profile = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useUserStats();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Account Details
          </h2>
          <div className="space-y-4">
            <DetailRow label="User ID" value={`#${user?.id}`} />
            <DetailRow label="Email Address" value={user?.email} />
            <DetailRow label="Full Name" value={user?.name} />
            <DetailRow label="Account Type" value={user?.role} />
            <DetailRow
              label="Account Status"
              value={
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 mr-1.5 bg-green-400 rounded-full"></span>
                  Active
                </span>
              }
            />
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Statistics
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <DetailRow label="Total Logins" value={stats?.totalLogins || 0} />
              <DetailRow label="Account Age" value={`${stats?.accountAge || 0} days`} />
              <DetailRow
                label="Last Login"
                value={new Date(stats?.lastLogin).toLocaleString()}
              />
              <DetailRow label="Active Sessions" value={stats?.activeSessionsCount || 0} />
            </div>
          )}
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Security & Authentication
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SecurityCard
            title="Access Token"
            status="Active"
            description="Valid for 30 seconds"
            icon="🔑"
            isActive={!!tokenManager.getAccessToken()}
          />
          <SecurityCard
            title="Refresh Token"
            status="Stored"
            description="Valid for 2 minutes"
            icon="🔄"
            isActive={!!tokenManager.getRefreshToken()}
          />
          <SecurityCard
            title="Two-Factor Auth"
            status="Not Enabled"
            description="Enhance security"
            icon="🛡️"
            isActive={false}
          />
          <SecurityCard
            title="Session Timeout"
            status="Auto Logout"
            description="On token expiry"
            icon="⏱️"
            isActive={true}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionButton
            icon="📧"
            title="Update Email"
            description="Change your email address"
          />
          <ActionButton
            icon="🔐"
            title="Change Password"
            description="Update your password"
          />
          <ActionButton
            icon="🎨"
            title="Customize Profile"
            description="Edit profile picture"
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

const SecurityCard = ({ title, status, description, icon, isActive }) => (
  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-start">
      <span className="text-2xl mr-3">{icon}</span>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, title, description }) => (
  <button className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition-all text-left">
    <div className="flex items-start">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export default Profile;
