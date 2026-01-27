import AddUserModal from "./components/AddUserModal";
import type { AddUserPayload } from "./components/AddUserModal";
import { useMemo, useState } from "react";
import UserDetailModal, { type UserDetail } from "./components/UserDetailModal";
import { RoleBadge, StatusBadge, UserAvatar } from "./components/UserTableElements";
import { useUsers } from "./hooks/useUsers";

const UsersPage = () => {
  const { userList, stats, loading, addUser } = useUsers();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  const [roleFilter, setRoleFilter] = useState("all");

  const filteredList = useMemo(() => {
    if (roleFilter === "all") return userList;
    console.log(userList);
    return userList.filter((user) => user.role === roleFilter);
  }, [userList, roleFilter]);

  const handleAddSubmit = async (data: AddUserPayload) => {
    await addUser(data);
  };
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Users
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage system access and permissions
          </p>
        </div>
        <button
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 w-full sm:w-auto justify-center group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
            add
          </span>
          <span className="font-medium text-sm">Add User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-xl p-5 flex items-center justify-between shadow-sm dark:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
          >
            <div className="flex flex-col">
              <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-gray-900 dark:text-white text-3xl font-bold mt-1">
                {stat.value}
              </span>
            </div>
            <div
              className={`flex items-center justify-center rounded-xl size-12 ${stat.colorClass}`}
            >
              <span className="material-symbols-outlined text-2xl">
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-xl">
         <div className="p-5 border-b border-gray-100 dark:border-[#111418] flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-input-bg">
          <div className="relative w-full sm:w-80">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              type="text"
              className="w-full bg-gray-50 dark:bg-[#1c2229] border border-gray-200 dark:border-[#3e4a56] rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              placeholder="Search users by name or email..."
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-gray-50 dark:bg-[#1c2229] border border-gray-200 dark:border-[#3e4a56] text-gray-900 dark:text-white text-sm rounded-lg block w-full sm:w-48 py-2.5 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none"
              >
              <option value="all">All Roles</option>
              <option value="Admin">Administrator</option>
              <option value="Staff">Staff Member</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
              <span className="material-symbols-outlined text-sm">
                expand_more
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229] border-b border-gray-100 dark:border-[#111418]">
                <th className="p-4 pl-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Profile
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Email Address
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Role
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 pr-6 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {loading && <tr><td colSpan={5} className="p-8 text-center text-text-secondary">Loading users...</td></tr>}
              
              {!loading && filteredList.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">
                    No users found matching filter.
                  </td>
                </tr>
              )}

              {filteredList.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group cursor-pointer"
                  onClick={() =>
                    setSelectedUser({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                      userId: user.userId,
                      role: user.role,
                      status: user.status,
                      lastLogin: user.lastLogin,
                      avatar: user.avatar,
                      initials: user.initials,
                      colorClass: user.colorClass,
                    })
                  }
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div>
                        <p className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="text-text-secondary text-xs">
                          Last login: {user.lastLogin}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div 
                      className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <button
                        className="p-2 text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3e4a56] rounded-lg transition-colors"
                        title="Edit User"
                        onClick={() => console.log("Edit", user)}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        className="p-2 text-text-secondary hover:text-[#fa6238] hover:bg-[#fa6238]/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-[#111418] bg-white dark:bg-[#1c2229] flex items-center justify-between text-xs text-text-secondary">
          <span>Showing {filteredList.length} users</span>
          <div className="flex items-center gap-2">
            <button
              className="p-1 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              disabled
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <span className="text-gray-900 dark:text-white font-medium">1</span>
            <button className="p-1 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={(u) => console.log("Edit", u)} 
          onDelete={(u) => console.log("Delete", u)}
        />
      )}
    </>
  );
};

export default UsersPage;