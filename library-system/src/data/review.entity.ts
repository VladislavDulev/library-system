import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Vote } from './votes/vote.entity';
import { Books } from './book.entity';
import { ReviewVote } from './votes/review-vote.entity';

@Entity('reviews')
export class Reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(
    () => Books,
    books => books.reviews,
  )
  books: Books;

  @ManyToOne(
    () => User,
    user => user.bookReviews,
  )
  user: User;

  @OneToMany(
    () => ReviewVote,
    vote => vote.reviews,
  )
  votes: ReviewVote[];
}
