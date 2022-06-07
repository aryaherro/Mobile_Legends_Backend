import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { HeroAttributes } from "../interfaces";
import Role from "./Role.model";

@Table({
  timestamps: true,
  underscored: true,
  freezeTableName: true,
})
export default class Hero extends Model<HeroAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;
  @Column({
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
  })
  release!: number;

  @Column({
    type: DataType.STRING,
  })
  image!: string;
  @Column({
    type: DataType.STRING,
  })
  image_url!: string;
  @BelongsToMany(() => Role, {
    through: {
      model: "Hero_Role",
    },
    timestamps: false,
    foreignKey: "Hero_id",
    otherKey: "Role_id",
  })
  roles!: Role[];
}
