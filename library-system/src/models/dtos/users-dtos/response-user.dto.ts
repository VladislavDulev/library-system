import { UserRole } from "src/models/enums/user-roles";
import { BookDTO } from "../book-dtos/book.dto";
import { BookVoteDTO } from "../votes-dtos/book-vote.dto";
import { ReviewVoteDTO } from "../votes-dtos/review-vote.dto";
import { ResponseReviewDTO } from "../reviews-dtos/review.dto";

export class ResponseUserDTO { 
  id: number;

  username: string;

  role: UserRole;

  isDeleted: boolean;

  isBanned: boolean

  books?: BookDTO[];

  bookVotes?: BookVoteDTO[];

  reviewVotes?: ReviewVoteDTO[];

  bookReviews?: ResponseReviewDTO[];

}