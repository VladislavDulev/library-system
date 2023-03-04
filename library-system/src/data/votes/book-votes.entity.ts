import { Entity, ManyToOne } from "typeorm";
import { Vote } from "./vote.entity";
import { User } from "../user.entity";
import { Books } from "../book.entity";

@Entity('book-vote')
export class BookVote extends Vote{
  @ManyToOne(
    () => Books,
    book => book.votes,
  )
  book: Books;

  @ManyToOne(
      () => User,
      user => user.booksVotes
  )
  user: User;
}