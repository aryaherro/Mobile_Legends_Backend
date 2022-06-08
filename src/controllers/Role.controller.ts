import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import Role from "../models/Role.model";

export default class RoleController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const response = await Role.findAll({
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
      const response = await Role.findOne({
        where: {
          id: req.params.id,
        },
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
      const file: any = req.files?.file;
      let fileName = "";
      let image_url = "";
      if (file) {
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        image_url = `${req.protocol}://${req.get(
          "host"
        )}/images/role/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
          res.status(422).json({ message: "Invalid Images" });
        if (fileSize > 5000000)
          res.status(422).json({ message: "Image must be less than 5 MB" });
        file.mv(
          `./public/images/role/${fileName}`,
          async (err: { message: any }) => {
            if (err) return res.status(500).json({ message: err.message });
          }
        );
      }

      await Role.create({
        name: name,
        image: fileName,
        image_url: image_url,
      });
      res.status(201).json({ message: "Product Created Successfuly" });
    } catch (error) {
      console.log(error);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    const role = await Role.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!role) res.status(404).json({ message: "Role Not Found" });

    const name = req.body.name;
    let fileName: string | undefined = role?.image;
    let image_url: string | undefined = role?.image_url;
    const file: any = req.files?.file;

    if (!req.files?.file) {
      fileName = "";
      image_url = "";
      if (req.body.deleted_image === "false") image_url = role?.image_url;
    } else {
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        res.status(422).json({ message: "Invalid Images" });
      if (fileSize > 5000000)
        res.status(422).json({ message: "Image must be less than 5 MB" });

      file.mv(`./public/images/role/${fileName}`, (err: any) => {
        if (err) return res.status(500).json({ message: err.message });
      });
      image_url = `${req.protocol}://${req.get(
        "host"
      )}/images/role/${fileName}`;
    }
    if (role?.image!) {
      const filepath = `./public/images/role/${role?.image}`;
      fs.unlinkSync(filepath);
    }
    try {
      await Role.update(
        { name: name, image: fileName, image_url: image_url },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Role Updated Successfuly" });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  static async destroy(req: Request, res: Response): Promise<void> {
    const role = await Role.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!role) res.status(404).json({ message: "Role Not Found" });

    try {
      const role = await Role.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (role?.image != "") {
        const filepath = `./public/images/role/${role?.image}`;
        fs.unlinkSync(filepath);
      }
      await Role.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "Role Deleted Successfuly" });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
