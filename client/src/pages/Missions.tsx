import { useEffect, useState } from "react";
import { getMissions } from "../api/mission.api";
import type { Mission } from "../types/global.types";
import MissionList from "../components/missions/MissionList";
import { searchBus } from "../utils/searchBus";
import { getSocket } from "../services/socket.service";
import { SOCKET_EVENTS } from "../services/socket.events";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMissions = async () => {
    try {
      const data = await getMissions();
      setMissions(data);
      setAllMissions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    const unsubscribe = searchBus.subscribe((value) => {
      const q = value.trim().toLowerCase();

      if (!q) {
        setMissions(allMissions);
        return;
      }

      const filtered = allMissions.filter((m) =>
        m.title.toLowerCase().includes(q),
      );

      setMissions(filtered);
    });

    return unsubscribe;
  }, [allMissions]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const addMission = (mission: Mission) => {
      setMissions((prev) => [mission, ...prev]);
      setAllMissions((prev) => [mission, ...prev]);
    };

    const updateMission = (mission: Mission) => {
      setMissions((prev) =>
        prev.map((m) => (m._id === mission._id ? mission : m)),
      );
      setAllMissions((prev) =>
        prev.map((m) => (m._id === mission._id ? mission : m)),
      );
    };

    const deleteMission = (mission: Mission) => {
      setMissions((prev) => prev.filter((m) => m._id !== mission._id));
      setAllMissions((prev) => prev.filter((m) => m._id !== mission._id));
    };

    socket.on(SOCKET_EVENTS.MISSION_CREATED, addMission);
    socket.on(SOCKET_EVENTS.MISSION_UPDATED, updateMission);
    socket.on(SOCKET_EVENTS.MISSION_DELETED, deleteMission);

    return () => {
      socket.off(SOCKET_EVENTS.MISSION_CREATED, addMission);
      socket.off(SOCKET_EVENTS.MISSION_UPDATED, updateMission);
      socket.off(SOCKET_EVENTS.MISSION_DELETED, deleteMission);
    };
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#f9f9f9] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">Missions</h1>

        <button
          onClick={() => navigate("/missions/add")}
          className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-black text-white
          hover:scale-[1.03] transition shadow-sm
        "
        >
          <Plus size={18} />
          <span className="text-sm font-semibold">Mission</span>
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <MissionList missions={missions} refresh={fetchMissions} />
      )}
    </div>
  );
}
