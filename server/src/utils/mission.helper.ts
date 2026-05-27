import Mission from "../modules/missions/mission.model.js";
import User from "../modules/users/user.model.js";
import { emitToUser } from "../sockets/socket.service.js";
import { SOCKET_EVENTS } from "../sockets/socket.events.js";

const getPopulatedMission = async (id: string) => {
  return await Mission.findById(id)
    .populate("createdBy", "firstName lastName avatar")
    .populate("assignedTo", "firstName lastName avatar")
    .lean();
};

const emitToAdminsAndManagers = async (event: string, mission: any) => {
  const users = await User.find({ role: { $in: ["ADMIN", "MANAGER"] } }).select(
    "_id",
  );
  users.forEach((user) => {
    emitToUser(user._id.toString(), event, mission);
  });
};

export const missionEvents = {
  created: async (mission: any) => {
    const fullMission = mission._id
      ? await getPopulatedMission(mission._id)
      : mission;

    if (fullMission?.assignedTo) {
      emitToUser(
        fullMission.assignedTo._id.toString(),
        SOCKET_EVENTS.MISSION_CREATED,
        fullMission,
      );
    }

    await emitToAdminsAndManagers(SOCKET_EVENTS.MISSION_CREATED, fullMission);
  },

  updated: async (mission: any) => {
    const fullMission = mission._id
      ? await getPopulatedMission(mission._id)
      : mission;

    if (fullMission?.assignedTo) {
      emitToUser(
        fullMission.assignedTo._id.toString(),
        SOCKET_EVENTS.MISSION_UPDATED,
        fullMission,
      );
    }

    await emitToAdminsAndManagers(SOCKET_EVENTS.MISSION_UPDATED, fullMission);
  },

  deleted: async (mission: any) => {
    const safeMission = mission?.toObject ? mission.toObject() : mission;

    if (safeMission?.assignedTo) {
      emitToUser(
        safeMission.assignedTo.toString(),
        SOCKET_EVENTS.MISSION_DELETED,
        safeMission,
      );
    }

    await emitToAdminsAndManagers(SOCKET_EVENTS.MISSION_DELETED, safeMission);
  },
};
