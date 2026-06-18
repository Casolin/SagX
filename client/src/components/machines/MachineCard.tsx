import { useNavigate } from "react-router-dom";
import {
  Trash2,
  SlidersHorizontal,
  AlertTriangle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import ConfirmModal from "../../components/ConfirmModal";
import EditMachineStatusModal from "./EditMachineStatusModal";
import { deleteMachine } from "../../api/machine.api";

import type { Machine } from "../../types/global.types";

type Props = {
  machine: Machine;
  refresh: () => void;
};

export default function MachineCard({ machine, refresh }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";

  const canEdit = isAdmin || isManager;

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteMachine(machine._id);
      toast.success("Machine deleted successfully");
      setOpenDelete(false);
      refresh();
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STATE VISUAL SYSTEM
  const state = machine.status;

  const stateConfig = {
    OK: {
      icon: CheckCircle2,
      glow: "shadow-green-200",
      border: "border-green-200",
      bg: "bg-white",
      text: "text-green-600",
    },
    MAINTENANCE: {
      icon: Wrench,
      glow: "shadow-yellow-300/40",
      border: "border-yellow-300",
      bg: "bg-yellow-50/30",
      text: "text-yellow-700",
    },
    DOWN: {
      icon: AlertTriangle,
      glow: "shadow-red-400/40",
      border: "border-red-400",
      bg: "bg-red-50/20 opacity-80",
      text: "text-red-600",
    },
  };

  const cfg = stateConfig[state];
  const Icon = cfg.icon;

  return (
    <>
      <div
        onClick={() => navigate(`/machines/${machine._id}/edit`)}
        className="
        group relative flex flex-col gap-3 p-4 rounded-xl
        border border-gray-200 dark:border-white/10
        bg-white shadow-sm  
        hover:shadow-lg hover:scale-[1.01]
        transition cursor-pointer
      "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 shadow-sm">
              <Icon
                size={18}
                className={
                  state === "DOWN"
                    ? "text-red-500"
                    : state === "MAINTENANCE"
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold truncate">{machine.name}</h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {machine.type || "Unknown machine"}
              </p>
            </div>
          </div>

          {/* STATUS BADGE */}
          <div
            className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border
            ${
              state === "DOWN"
                ? "text-red-600 border-red-200 dark:border-red-500/20 bg-red-50/40 dark:bg-red-500/10"
                : state === "MAINTENANCE"
                ? "text-yellow-600 border-yellow-200 dark:border-yellow-500/20 bg-yellow-50/40 dark:bg-yellow-500/10"
                : "text-green-600 border-green-200 dark:border-green-500/20 bg-green-50/40 dark:bg-green-500/10"
            }
          `}
          >
            <Icon size={12} />
            {machine.status}
          </div>
        </div>

        {/* META */}
        <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 dark:text-gray-400">
          <span>📍 {machine.location || "No location"}</span>
          {machine.failureType && <span>⚠ {machine.failureType}</span>}
        </div>

        {/* DESCRIPTION */}
        {machine.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {machine.description}
          </p>
        )}

        {/* ACTIONS */}
        {canEdit && (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenEdit(true);
              }}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <SlidersHorizontal size={15} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDelete(true);
              }}
              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* MODALS */}
      <EditMachineStatusModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        machine={machine}
        refresh={refresh}
      />

      <ConfirmModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Machine"
        message="Are you sure you want to delete this machine?"
        confirmText="Delete"
        loading={loading}
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}
