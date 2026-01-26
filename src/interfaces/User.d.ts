interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Staff";
  status: "Active" | "Inactive";
  lastLogin: string;
  avatar?: string;
  initials?: string;
  colorClass?: string;
}

interface UserStat {
  label: string;
  value: string;
  icon: string;
  colorClass: string;
}
