import { BookVoteDTO } from "../votes-dtos/book-vote.dto";
import { UserDTO } from "../users-dtos/user.dto";
import { ResponseReviewDTO } from "../reviews-dtos/review.dto";

export class BookDTO {
    id: number;

    title: string;

    coverURL: string;

    content: string;

    isBorrowed: boolean;
    
    isDeleted: boolean;

    reviews?: ResponseReviewDTO[];

    bookVotes?: BookVoteDTO[];

    borrower?: UserDTO;
}