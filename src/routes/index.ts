import express from "express";
import RoleRoutes from "./role.routes";
import HeroRoutes from "./hero.routes";

const router = express.Router();

router.use("/role", RoleRoutes);
router.use("/hero", HeroRoutes);

export default router;
