import express from "express";
import HeroController from "../controllers/Hero.controller";

const router = express.Router();

router.get("/", HeroController.index); // get all hero
router.post("/", HeroController.store); // add hero
router.get("/:id", HeroController.show); // get hero by id
router.patch("/:id", HeroController.update); // update hero
router.delete("/:id", HeroController.destroy); // delete hero

export default router;
