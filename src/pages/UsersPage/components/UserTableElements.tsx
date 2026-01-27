export const UserAvatar = ({ user }: { user: User }) => {
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

export const RoleBadge = ({ role }: { role: string }) => {
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

export const StatusBadge = ({ status }: { status: string }) => {
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