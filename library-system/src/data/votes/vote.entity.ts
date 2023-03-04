import { Reaction } from '../../models/enums/reactions';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { User } from '../user.entity';

@Entity('votes')
export abstract class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  abstract user: User;

  @Column()
  reaction: Reaction;

  @Column({default: false, nullable: false})
  isDeleted: boolean;
}

