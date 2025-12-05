const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");

router.post("/", groupController.createGroup);

router.get("/user:user_id", groupController.getUserGroups);

router.get("/:group_id/members", groupController.getGroupMember);

router.patch("//:group_id/members/:user_id/tag", groupController.updateTag);

router.post("/:id/members", groupController.addMember);

router.get("/:id", groupController.getGroupById);

module.exports = router;