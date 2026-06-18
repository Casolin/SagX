import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsers, deleteUser } from "../api/admin.api";
import type { User } from "../types/global.types";

import UserList from "../components/users/UserList";
import { Plus } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await getUsers();

        setUsers(data || []);
      } catch (err) {
        console.error("Failed to load users", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/users/${user._id}`);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f9f9f9] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">Users</h1>

        <button
          onClick={() => navigate("/users/add")}
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl
            bg-black text-white
            hover:scale-[1.03] transition shadow-sm
          "
        >
          <Plus size={18} />
          <span className="text-sm font-semibold">Users</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
