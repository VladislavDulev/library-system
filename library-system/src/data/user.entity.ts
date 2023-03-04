import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Vote } from './votes/vote.entity';
import { UserRole } from 'src/models/enums/user-roles';
import { Books } from './book.entity';
import { Reviews } from './review.entity';
import {} from './review.entity';
import { BookVote } from './votes/book-votes.entity';
import { ReviewVote } from './votes/review-vote.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Basic,
  })
  role: UserRole;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(
    () => Books,
    books => books.borrower,
  )
  books: Books[];

  @OneToMany(
    () => BookVote,
    votes => votes.user,
  )
  booksVotes: BookVote[];

  @OneToMany(
    () => ReviewVote,
    votes => votes.user,
  )
  reviewVotes: ReviewVote[];

  @OneToMany(
    () => Reviews,
    reviews => reviews.user,
  )
  bookReviews: Reviews[];

  @Column({ nullable: true, default: false })
  isBanned: boolean;

}
