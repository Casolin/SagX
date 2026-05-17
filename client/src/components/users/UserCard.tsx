import { useState } from "react";
import { notify } from "../../utils/toastify";

import type { User } from "../../types/global.types";
import ConfirmModal from "../ConfirmModal";

interface Props {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function UserCard({ user, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleColor = {
    ADMIN: "bg-orange-500 text-white",
    MANAGER: "bg-indigo-500 text-white",
    TECHNICIAN: "bg-gray-800 text-white",
  }[user.role];

  const statusColor =
    {
      ACTIVE: "bg-green-500 text-white",
      INACTIVE: "bg-gray-400 text-white",
      SUSPENDED: "bg-red-500 text-white",
    }[user.status] || "bg-gray-300 text-black";

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(user._id);
      notify.info("User deleted successfully");
      setOpen(false);
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CARD */}
      <div
        className="
          w-full flex flex-col sm:flex-row items-center justify-between
          bg-white border border-gray-100
          rounded-2xl p-4 sm:p-5 shadow-sm
          hover:shadow-md transition
        "
      >
        {/* LEFT: Avatar + Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-4 w-full sm:w-auto">
          <img
            src={user.avatar}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border object-cover"
          />

          <div className="text-center sm:text-left flex-1">
            <h3 className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>

            <p className="text-sm text-gray-500 truncate">{user.email}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className={`text-xs px-3 py-1 rounded-full ${roleColor}`}>
                {user.role}
              </span>

              <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
          <button
            onClick={() => onEdit(user)}
            className="
              bg-indigo-600 hover:bg-indigo-700
              text-white px-4 py-2 rounded-xl
              text-sm font-medium transition cursor-pointer
              w-full sm:w-auto
            "
          >
            Edit
          </button>

          <button
            onClick={() => setOpen(true)}
            className="
              bg-red-500 hover:bg-red-600
              text-white px-4 py-2 rounded-xl
              text-sm font-medium transition cursor-pointer
              w-full sm:w-auto
            "
          >
            Delete
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}
