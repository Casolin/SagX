import { createMission } from "../missions/mission.service.js";

export const handleMachineFailure = async (machine: any, userId: string) => {
  const failureType = machine.failureType || machine.condition;

  const mission = await createMission(
    {
      title: `Repair ${machine.name}`,
      description: `Auto-generated mission due to ${failureType}`,

      machine: machine._id,

      priority: "HIGH",
      requiredSkills: [failureType],

      tasks: [
        {
          title: "Diagnose issue",
          status: "PENDING",
          source: "AUTO",
          priority: "MEDIUM",
          estimatedTime: 30,
          progress: 0,
        },
        {
          title: "Fix components",
          status: "PENDING",
          source: "AUTO",
          priority: "MEDIUM",
          estimatedTime: 60,
          progress: 0,
        },
      ],
    },
    userId,
  );

  return mission;
};
