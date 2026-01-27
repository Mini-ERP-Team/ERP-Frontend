
import { useState, useEffect, useMemo } from "react";
import usersApi, { type UserDto } from "../../../api/usersApi";
import type { AddUserPayload } from "../components/AddUserModal";
import { formatDistanceToNow } from "date-fns";

const mapApiRoleToLabel = (role: string): User["role"] => {
  const normalized = role?.toUpperCase?.() ?? "";
  return normalized === "ADMIN" ? "Admin" : "Staff";
};

const getInitials = (fullName: string | null | undefined) => {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const initials = parts.map((p) => p[0]?.toUpperCase()).join("");
  return initials || "U";
};

const roleColorClass = (roleLabel: User["role"]) => {
  return roleLabel === "Admin"
    ? "text-purple-400 bg-purple-500/20 border-purple-500/30"
    : "text-blue-400 bg-blue-500/20 border-blue-500/30";
};

const mapDtoToUserRow = (dto: UserDto): User => {
  const roleLabel = mapApiRoleToLabel(dto.vaitro);

  let relativeTime = "Never";
  if (dto.lancuoidangnhap) {
    try {
      relativeTime = formatDistanceToNow(new Date(dto.lancuoidangnhap), { 
        addSuffix: true,
      });
    } catch (e) {
      relativeTime = "Unknown";
    }
  }
  
  return {
    id: String(dto.idnguoidung),
    name: dto.hoten,
    email: dto.mail,
    phone: dto.sdt ?? undefined,
    userId: dto.manhanvien ?? undefined,
    role: roleLabel,
    status: dto.trangthai ? "Active" : "Inactive",
    lastLogin: relativeTime,
    initials: getInitials(dto.hoten),
    colorClass: roleColorClass(roleLabel),
  };
};

export const useUsers = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await usersApi.getAllUsers();
        if (res.data && res.data.data) {
          const mapped = res.data.data.map((user: UserDto) => mapDtoToUserRow(user));
          setUserList(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const stats: UserStat[] = useMemo(() => {
    const total = userList.length;
    const admins = userList.filter((u) => u.role === "Admin").length;
    const staff = userList.filter((u) => u.role === "Staff").length;
    const activeNow = userList.filter((u) => u.status === "Active").length;

    return [
      { label: "Total Users", value: String(total), icon: "group", colorClass: "text-primary bg-primary/20" },
      { label: "Admins", value: String(admins), icon: "shield_person", colorClass: "text-purple-400 bg-purple-500/20" },
      { label: "Staff", value: String(staff), icon: "badge", colorClass: "text-orange-400 bg-orange-500/20" },
      { label: "Active Now", value: String(activeNow), icon: "radio_button_checked", colorClass: "text-[#0bda5b] bg-[#0bda5b]/20" },
    ];
  }, [userList]);

  const addUser = async (payload: AddUserPayload) => {
    const roleLabel = payload.vaitro === "ADMIN" ? "Admin" : "Staff";
    
    const res = await usersApi.createUser({
      hoten: payload.hoten,
      mail: payload.email,
      matkhau: payload.matkhau,
      vaitro: payload.vaitro,
      sdt: payload.sdt || undefined,
      manhanvien: payload.manhanvien || undefined,
      trangthai: true,
    });

    const newUserDto: UserDto = res.data.data;
    if (newUserDto) {
      const created = mapDtoToUserRow(newUserDto);
      created.role = roleLabel;
      setUserList((prev) => [created, ...prev]);
    }
  };

  return {
    userList,
    stats,
    loading,
    addUser,
  };
};