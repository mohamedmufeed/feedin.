import express from "express";
import { blockOrUnblockUser, getUsers } from "../../controller/admin/userManagementController";
import protect from "../../middleware/authMiddlwware";
import { addPreference, getPreferences, removePreference } from "../../controller/admin/PreferenceManagementController";
const router = express.Router()
// users
router
  .get("/users", protect, getUsers)
  .patch("/users/:id/block", protect, blockOrUnblockUser)

  // dasd

//  preferences

router
  .post("/preferences", protect, addPreference)
  .get("/preferences", protect, getPreferences)
  .delete("/preferences/:id", protect, removePreference);
export default router