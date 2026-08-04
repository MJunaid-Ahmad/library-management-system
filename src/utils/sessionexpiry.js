import cron from "node-cron";
import sessionModel from "../model/sessionModel.js";

export default function expiredSessionCleanup() {
  cron.schedule("*/1 * * * * *", async () => {
    await sessionModel.updateMany(
      {
        isActive: true,
        expiresAt: { $lt: Date.now() },
      },
      {
        $set: {
          isActive: false,
          logoutTime: new Date(),
          lastActivity: new Date(),
        },
      },
    );
  });
}
