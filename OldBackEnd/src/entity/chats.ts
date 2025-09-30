import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./users";

@Entity({
  name: "chats",
})
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
  })
  message: string;

  @Column({
    nullable: true,
  })
  attachment: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.chat, {
    eager: true,
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({
    nullable: true,
  })
  replyId: number;

  @ManyToOne(() => Chat, (chat) => chat.replyId)
  @JoinColumn({ name: "replyId" })
  reply: Chat;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
