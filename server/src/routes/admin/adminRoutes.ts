import express from "express";
import { blockOrUnblockUser, getUsers } from "../../controller/admin/userManagementController";
import protect from "../../middleware/authMiddlwware";
import { addPreference, getPreferences, removePreference } from "../../controller/admin/PreferenceManagementController";
import { dashBoardStats } from "../../controller/admin/dashboardController";
import adminOnly from "../../middleware/adminOnly";
const router = express.Router()
// users
router
  .get("/users", protect,adminOnly, getUsers)
  .patch("/users/:id/block", protect, adminOnly, blockOrUnblockUser)

  // dashboard
  router
  .get("/stats", protect, adminOnly,dashBoardStats)

//  preferences

router
  .post("/preferences", protect, adminOnly, addPreference)
  .get("/preferences", protect, adminOnly, getPreferences)
  .delete("/preferences/:id", protect, adminOnly, removePreference);
export default router