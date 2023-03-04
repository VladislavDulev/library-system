import { Entity, ManyToOne } from "typeorm";
import { Vote } from "./vote.entity";
import { Reviews } from "../review.entity";
import { User } from "../user.entity";

@Entity('review-vote')
export class ReviewVote extends Vote{
  @ManyToOne(
    () => Reviews,
    review => review.votes,
  )
  reviews: Reviews;

  @ManyToOne(
      () => User,
      user => user.reviewVotes
  )
  user: User;
}