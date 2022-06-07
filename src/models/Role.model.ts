import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { RoleAttributes } from "../interfaces";
import Hero from "./Hero.model";

@Table({
  timestamps: true,
  underscored: true,
  freezeTableName: true,
})
export default class Role extends Model<RoleAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Unique(true)
  @Column({
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
  })
  image!: string;
  @Column({
    type: DataType.STRING,
  })
  image_url!: string;
  @BelongsToMany(() => Hero, "hero_role", "role_id", "hero_id")
  heroes!: Hero[];
}
