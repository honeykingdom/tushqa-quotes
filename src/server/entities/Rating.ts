import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
class Rating extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  _id: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  value: number;

  @Field(() => Number)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Number)
  @UpdateDateColumn()
  updatedAt: Date;
}

export default Rating;
