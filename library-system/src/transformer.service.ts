import { Books } from './data/book.entity';
import { Reviews } from './data/review.entity';
import { ResponseReviewDTO } from './models/dtos/reviews-dtos/review.dto';
import { User } from './data/user.entity';
import { ResponseUserDTO } from './models/dtos/users-dtos/response-user.dto';
import { CreateUserDTO } from './models/dtos/users-dtos/create-user.dto';
import { BookDTO } from './models/dtos/book-dtos/book.dto';
import { CreateReviewDTO } from './models/dtos/reviews-dtos/create-review.dto';
import { BookVote } from './data/votes/book-votes.entity';
import { BookVoteDTO } from './models/dtos/votes-dtos/book-vote.dto';
import { ReviewVote } from './data/votes/review-vote.entity';
import { ReviewVoteDTO } from './models/dtos/votes-dtos/review-vote.dto';


export class TransformService {
  [x: string]: any;
  // create more detailed review with options what to load
  toReturnReviewsDTO(reviews: Reviews, stop = false): ResponseReviewDTO {
    if(stop){
      return {
        id: reviews.id,
        content: reviews.content,
        isDeleted: reviews.isDeleted,
        user: this.toResponseUserDTO(reviews.user, true)
      };  
    }
    return {
      id: reviews.id,
      content: reviews.content,
      isDeleted: reviews.isDeleted,
      book: this.toBookResponseDTO(reviews.books, true),
      user: this.toResponseUserDTO(reviews.user, true)
    };
  }

  toBookVoteDTO(bookVote: BookVote, stop = false): BookVoteDTO {
    if(stop) {
      return {
        id: bookVote.id,
        user: this.toResponseUserDTO(bookVote.user, true),
        reaction: bookVote.reaction
      }  
    }

    return {
      id: bookVote.id,
      book: this.toBookResponseDTO(bookVote.book, true),
      user: this.toResponseUserDTO(bookVote.user, true),
      reaction: bookVote.reaction
    }
  }

  toReviewVoteDTO(reviewVote: ReviewVote, stop = false): ReviewVoteDTO {
    if(stop) {
      return {
        id: reviewVote.id,
        isDeleted: reviewVote.isDeleted,
        user: this.toResponseUserDTO(reviewVote.user, true),
        reaction: reviewVote.reaction
      }  
    }
    return {
      id: reviewVote.id,
      isDeleted: reviewVote.isDeleted,
      review: this.toReturnReviewsDTO(reviewVote.reviews, true),
      user: this.toResponseUserDTO(reviewVote.user, true),
      reaction: reviewVote.reaction
    }
  }

  //create more detailed book dto with options what to load
  toBookResponseDTO(book: Books, stop = false): BookDTO{
    if (stop) {
      return {
        id: book.id,
        content: book.content,
        title: book.title,
        isBorrowed: book.isBorrowed,
        isDeleted: book.isBorrowed,
        coverURL: book.coverURL
      };
    }
    return {
      id: book.id,
      content: book.content,
      title: book.title,
      isBorrowed: book.isBorrowed,
      isDeleted: book.isDeleted,
      coverURL: book.coverURL,
      reviews: book.reviews.map(r => this.toReturnReviewsDTO(r, true)),
      bookVotes: book.votes.map(v => this.toBookVoteDTO(v, true)),
      borrower: Boolean(book.borrower) ? this.toResponseUserDTO(book.borrower, true) : null
    };
  }

  toResponseUserDTO(user: User, stop = false): ResponseUserDTO {
    if(stop)
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        isBanned: user.isBanned,
        isDeleted: user.isDeleted
      };

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      isBanned: user.isBanned,
      isDeleted: user.isDeleted,
      bookReviews: user.bookReviews.map(r => this.toReturnReviewsDTO(r, true)),
      bookVotes: user.booksVotes.map(v => this.toBookVoteDTO(v, true)),
      reviewVotes: user.reviewVotes.map(v => this.toReviewVoteDTO(v, true)),
      books: user.books.map(b => this.toBookResponseDTO(b, true))
    }
  }
}