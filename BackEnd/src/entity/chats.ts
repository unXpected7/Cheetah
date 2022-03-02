import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToOne,
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

  @ManyToOne(() => User, (user) => user.chat)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({
    nullable: true,
  })
  replyId: number;

  @OneToOne(() => Chat, (chat) => chat.replyId)
  @JoinColumn({ name: "replyId" })
  reply: Chat;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
