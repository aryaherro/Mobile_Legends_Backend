import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import Hero from "../models/Hero.model";
import Role from "../models/Role.model";

export default class HeroController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const response = await Hero.findAll({
        include: [
          {
            model: Role,
            through: {
              attributes: [],
            },
            attributes: { exclude: ["createdAt", "updatedAt", "Hero_Role"] },
          },
        ],
        order: [["name", "ASC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json(response);
    } catch (e) {
      res.status(400).json(e);
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    try {
      const response = await Hero.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Role,
            through: {
              attributes: [],
            },
            attributes: { exclude: ["createdAt", "updatedAt", "Hero_Role"] },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(201).json(response);
    } catch (e) {
      res.status(400).json(e);
    }
  }

  static async store(req: Request, res: Response): Promise<void> {
    try {
      const name = req.body.name;
      const release = parseInt(req.body.release);
      const roles = JSON.parse(req.body.roles);
      const file: any = req.files?.file;
      let fileName = "";
      let image_url = "";
      if (file) {
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        image_url = `${req.protocol}://${req.get(
          "host"
        )}/images/hero/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
          res.status(422).json({ message: "Invalid Images" });
        if (fileSize > 5000000)
          res.status(422).json({ message: "Image must be less than 5 MB" });
        file.mv(
          `./public/images/hero/${fileName}`,
          async (err: { message: any }) => {
            if (err) return res.status(500).json({ message: err.message });
          }
        );
      }
      const hero = await Hero.create({
        name: name,
        release: release,
        image: fileName,
        image_url: image_url,
      });
      hero.$set("roles", roles);

      res.status(201).json({ message: "Hero Created Successfuly" });
    } catch (error) {
      console.log(error);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    const hero = await Hero.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!hero) res.status(404).json({ message: "Hero Not Found" });

    const name = req.body.name;
    const release = parseInt(req.body.release);
    const roles = JSON.parse(req.body.roles).map((role: any) => role.value);
    console.log(roles);
    let fileName: string | undefined = hero?.image;
    let image_url: string | undefined = hero?.image_url;
    const file: any = req.files?.file;

    if (!req.files?.file) {
      fileName = "";
      image_url = "";
      if (req.body.deleted_image === "false") image_url = hero?.image_url;
    } else {
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        res.status(422).json({ message: "Invalid Images" });
      if (fileSize > 5000000)
        res.status(422).json({ message: "Image must be less than 5 MB" });

      file.mv(`./public/images/hero/${fileName}`, (err: any) => {
        if (err) return res.status(500).json({ message: err.message });
      });
      image_url = `${req.protocol}://${req.get(
        "host"
      )}/images/hero/${fileName}`;
    }
    if (hero?.image != "") {
      const filepath = `./public/images/hero/${hero?.image}`;
      fs.unlinkSync(filepath);
    }
    try {
      hero!.name = name;
      hero!.release = release;
      hero!.image = fileName;
      hero!.image_url = image_url!;
      await hero?.save();
      hero!.$set("roles", roles);
      res.status(200).json({ message: "Hero Updated Successfuly" });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  static async destroy(req: Request, res: Response): Promise<void> {
    const hero = await Hero.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!hero) res.status(404).json({ message: "Hero Not Found" });

    try {
      const hero = await Hero.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (hero?.image != "") {
        const filepath = `./public/images/hero/${hero?.image}`;
        fs.unlinkSync(filepath);
      }
      await Hero.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "Hero Deleted Successfuly" });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
