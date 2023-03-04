import { Reviews } from './review.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { BookVote } from './votes/book-votes.entity';

@Entity('books')
export class Books {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  coverURL: string;

  @Column({ default: false })
  isBorrowed: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(
    () => Reviews,
    review => review.books,
  )
  reviews: Reviews[];

  @OneToMany(
    () => BookVote,
    vote => vote.book,
  )
  votes: BookVote[];

  @ManyToOne(
    () => User,
    user => user.books,
  )
  borrower: User;
}
