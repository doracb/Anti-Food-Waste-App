const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");

router.post("/", groupController.createGroup);

router.get("/user/:user_id", groupController.getUserGroups);

router.get("/:group_id/members", groupController.getGroupMembers);

router.patch("/:group_id/transfer", groupController.transferOwnership);

router.patch("/:group_id/members/:user_id/tag", groupController.updateTag);

router.post("/:group_id/leave", groupController.leaveGroup);

router.post("/:group_id/members", groupController.addMember);

router.get("/:group_id", groupController.getGroupById);

router.delete("/:group_id", groupController.deleteGroup);

router.get("/:group_id/foods", groupController.getGroupFoods);

module.exports = router;