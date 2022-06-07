import Role from "../models/Role.model";
import Hero from "../models/Hero.model";
import roleJson from "./role.json";
import heroJson from "./hero.json";

export default async () => {
  let role = await Role.bulkCreate(roleJson);
  heroJson.forEach(async (hero) => {
    let h = await Hero.create({
      name: hero.name,
      release: hero.release,
      image_url: hero.image_url,
    });
    role
      .filter((r) => hero.role.includes(r.name))
      .forEach(async (r) => {
        h.$set("roles", [r]);
      });
  });
};
