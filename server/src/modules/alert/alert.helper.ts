import User from "../users/user.model.js";
import Alert from "../alert/alert.model.js";
import { emitToUser } from "../../sockets/socket.service.js";
import { SOCKET_EVENTS } from "../../sockets/socket.events.js";

const getPopulatedAlert = async (alertId: string) => {
  return await Alert.findById(alertId).populate("machine", "name").lean();
};

const populateMachineIfNeeded = async (alert: any) => {
  if (alert.machine && typeof alert.machine === "string") {
    return await Alert.populate(alert, {
      path: "machine",
      select: "name",
    });
  }
  return alert;
};

const broadcastAlert = async (alert: any, event: string) => {
  const populatedAlert = alert._id
    ? await getPopulatedAlert(alert._id)
    : await populateMachineIfNeeded(alert.alert || alert);

  if (!populatedAlert) return;

  const adminsAndManagers = await User.find({
    role: { $in: ["ADMIN", "MANAGER"] },
  }).select("_id");
  adminsAndManagers.forEach((user) => {
    emitToUser(user._id.toString(), event, populatedAlert);
  });

  if (populatedAlert.createdBy) {
    const tech = await User.findOne({
      _id: populatedAlert.createdBy,
      role: "TECHNICIAN",
    }).select("_id");
    if (tech) {
      emitToUser(tech._id.toString(), event, populatedAlert);
    }
  }
};

export const broadcastAlertCreated = async (alert: any) =>
  broadcastAlert(alert, SOCKET_EVENTS.ALERT_CREATED);

export const broadcastAlertUpdated = async (alert: any) =>
  broadcastAlert(alert, SOCKET_EVENTS.ALERT_UPDATED);

export const broadcastAlertDeleted = async (alert: any) => {
  let populatedAlert = alert;

  if (alert.machine && typeof alert.machine === "string") {
    populatedAlert = await Alert.populate(alert, {
      path: "machine",
      select: "name",
    });
  }

  const adminsAndManagers = await User.find({
    role: { $in: ["ADMIN", "MANAGER"] },
  }).select("_id");

  adminsAndManagers.forEach((user) => {
    emitToUser(
      user._id.toString(),
      SOCKET_EVENTS.ALERT_DELETED,
      populatedAlert,
    );
  });

  if (populatedAlert.createdBy) {
    emitToUser(
      populatedAlert.createdBy.toString(),
      SOCKET_EVENTS.ALERT_DELETED,
      populatedAlert,
    );
  }
};
