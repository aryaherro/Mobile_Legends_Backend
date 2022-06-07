import express from "express";
import RoleController from "../controllers/Role.controller";

const router = express.Router();

router.get("/", RoleController.index); // get all role
router.post("/", RoleController.store); // add role
router.get("/:id", RoleController.show); // get role by id
router.patch("/:id", RoleController.update); // update role
router.delete("/:id", RoleController.destroy); // delete role

export default router;
