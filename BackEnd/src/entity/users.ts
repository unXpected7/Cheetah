import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Chat } from "./chats";

@Entity({
  name: "users",
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  avatar: string;

  @Column({
    unique: true,
  })
  nickname: string;

  @Column({ nullable: true })
  socketId: string;

  @Column()
  password: string;

  @OneToMany(() => Chat, (Chat) => Chat.user)
  chat: Chat[];

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
