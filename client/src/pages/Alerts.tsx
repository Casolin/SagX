import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertList from "../components/alerts/AlertList";
import { useAuth } from "../hooks/useAuth";
import { Plus } from "lucide-react";

export default function AlertsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const canView =
    user?.role === "ADMIN" ||
    user?.role === "MANAGER" ||
    user?.role === "TECHNICIAN";

  useEffect(() => {
    if (!canView) {
      navigate("/unauthorized", { replace: true });
    }
  }, [canView, navigate]);

  if (!canView) return null;

  return (
    <div className="p-6 space-y-6 bg-[#f9f9f9] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">Alerts</h1>

        <button
          onClick={() => navigate("/alerts/add")}
          className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-black text-white
          hover:scale-[1.03] transition shadow-sm
        "
        >
          <Plus size={18} />
          <span className="text-sm font-semibold">Alert</span>
        </button>
      </div>
      <AlertList />
    </div>
  );
}
