import AddUserModal from "./components/AddUserModal";
import type { AddUserPayload, UserRole } from "./components/AddUserModal";
import { useMemo, useState } from "react";
import UserDetailModal, { type UserDetail } from "./components/UserDetailModal";

type UserStat = {
  label: string;
  value: string;
  icon: string;
  colorClass: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Staff";
  status: "Active" | "Inactive";
  lastLogin: string;
  avatar?: string;
  initials?: string;
  colorClass?: string;
};

const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@retailmanager.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2 mins ago",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqceyoUkFrVqzLlH36De3AjFawKsxofevlUoSMq9EaSNwN3zFJHBO9tTt5e00dVcrF7mx4Y7Sk6ImQ8jpcbKE7gWYSXJqcqeKgkC8tpq0FH4b9maYnYhk0_TMr1Z8AidmgUwUz98FCO-hGzDLO0Bjpca6wOiRSgtFU8u8-kQgvNMSGOIXq0WBiFXb2GvPIYogKp0qcg76chHWhuYWko20l6qhlftKUA1Uz19P57XpiidtPnBUPOLXwvJVT8UpEHXKMAX3rdtqoKEc",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah.miller@retailmanager.com",
    role: "Staff",
    status: "Active",
    lastLogin: "1 hour ago",
    initials: "SM",
    colorClass: "text-purple-400 bg-purple-500/20 border-purple-500/30",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "m.johnson@retailmanager.com",
    role: "Staff",
    status: "Inactive",
    lastLogin: "3 days ago",
    initials: "MJ",
    colorClass: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@retailmanager.com",
    role: "Admin",
    status: "Active",
    lastLogin: "5 mins ago",
    initials: "ED",
    colorClass: "text-orange-400 bg-orange-500/20 border-orange-500/30",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@retailmanager.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2 days ago",
    initials: "DW",
    colorClass: "text-pink-400 bg-pink-500/20 border-pink-500/30",
  },
];

const UserAvatar = ({ user }: { user: User }) => {
  if (user.avatar) {
    return (
      <div
        className="size-10 rounded-full bg-center bg-cover border border-gray-200 dark:border-[#3e4a56]"
        style={{ backgroundImage: `url("${user.avatar}")` }}
      ></div>
    );
  }
  return (
    <div
      className={`size-10 rounded-full flex items-center justify-center font-bold text-sm border ${user.colorClass}`}
    >
      {user.initials}
    </div>
  );
};

const RoleBadge = ({ role }: { role: string }) => {
  const isAdmin = role === "Admin";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        isAdmin
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-gray-100 dark:bg-[#3e4a56]/50 text-gray-600 dark:text-text-secondary border-gray-200 dark:border-[#3e4a56]"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${isAdmin ? "bg-primary" : "bg-gray-500 dark:bg-text-secondary"}`}
      ></span>
      {role}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-[#0bda5b]/10 text-[#0bda5b]"
          : "bg-[#fa6238]/10 text-[#fa6238]"
      }`}
    >
      {status}
    </span>
  );
};

const UsersPage = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userList, setUserList] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const stats: UserStat[] = useMemo(() => {
    const total = userList.length;
    const admins = userList.filter((u) => u.role === "Admin").length;
    const staff = userList.filter((u) => u.role === "Staff").length;
    const activeNow = userList.filter((u) => u.status === "Active").length;

    return [
      {
        label: "Total Users",
        value: String(total),
        icon: "group",
        colorClass: "text-primary bg-primary/20",
      },
      {
        label: "Admins",
        value: String(admins),
        icon: "shield_person",
        colorClass: "text-purple-400 bg-purple-500/20",
      },
      {
        label: "Staff",
        value: String(staff),
        icon: "badge",
        colorClass: "text-orange-400 bg-orange-500/20",
      },
      {
        label: "Active Now",
        value: String(activeNow),
        icon: "radio_button_checked",
        colorClass: "text-[#0bda5b] bg-[#0bda5b]/20",
      },
    ];
  }, [userList]);

  const mapRoleLabel = (role: UserRole): User["role"] => {
    if (role === "ADMIN") return "Admin";
    if (role === "STAFF") return "Staff";
    return "Staff";
  };

  const getInitials = (fullName: string) => {
    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    const initials = parts.map((p) => p[0]?.toUpperCase()).join("");
    return initials || "U";
  };

  const roleColorClass = (roleLabel: User["role"]) => {
    if (roleLabel === "Admin")
      return "text-purple-400 bg-purple-500/20 border-purple-500/30";
    if (roleLabel === "Staff")
      return "text-blue-400 bg-blue-500/20 border-blue-500/30";
  };

  const handleAddUserSubmit = (payload: AddUserPayload) => {
    const roleLabel = mapRoleLabel(payload.vaitro);

    const newUser: User = {
      id: String(Date.now()),
      name: payload.hoten,
      email: payload.email,
      role: roleLabel,
      status: "Active",
      lastLogin: "just now",
      initials: getInitials(payload.hoten),
      colorClass: roleColorClass(roleLabel),
    };

    setUserList((prev) => [newUser, ...prev]);
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
            <select className="appearance-none bg-gray-50 dark:bg-[#1c2229] border border-gray-200 dark:border-[#3e4a56] text-gray-900 dark:text-white text-sm rounded-lg block w-full sm:w-48 py-2.5 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none">
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="staff">Staff Member</option>
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
              {userList.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group cursor-pointer"
                  onClick={() => setSelectedUser(user)}
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
          <span>Showing 5 of 12 users</span>
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
        onSubmit={handleAddUserSubmit}
      />

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default UsersPage;
