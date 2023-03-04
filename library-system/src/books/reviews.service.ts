import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/data/book.entity';
import { Repository } from 'typeorm';
import { Reviews } from 'src/data/review.entity';
import { User } from 'src/data/user.entity';
import { TransformService } from 'src/transformer.service';
import { ResponseReviewDTO } from 'src/models/dtos/reviews-dtos/review.dto';
import { CreateReviewDTO } from 'src/models/dtos/reviews-dtos/create-review.dto';
import { ReviewVote } from 'src/data/votes/review-vote.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Books)
    private readonly booksRepository: Repository<Books>,
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
    @InjectRepository(ReviewVote)
    private readonly reviewsVoteRepository: Repository<ReviewVote>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly transformer: TransformService,
    ) {}
    
    //Get reviews -> [V]
    //Post reviews -> []
    //Change reviews -> []
    //Delete reviews -> []
  public async readBookReviews(bookId: number): Promise<ResponseReviewDTO[]> {
    const allBooks = await this.findOneBookOrFail(bookId);

    const result = allBooks.reviews.filter(r => r.isDeleted === false);

    return result.map(reviews => this.transformer.toReturnReviewsDTO(reviews));
  }

  public async readBookReviewsFromUser(userId: number): Promise<ResponseReviewDTO[]> {
    console.log('in')
    const userEntity = await this.findOneUserOrFail(userId);

    const result = userEntity.bookReviews.filter(r => r.isDeleted === false);

    return result.map(reviews => this.transformer.toReturnReviewsDTO(reviews));
  }

  public async getOneReview(bookId: number, reviewId: number): Promise<ResponseReviewDTO> {
    const reviewEntity = await this.reviewsRepository.findOne(reviewId, {
      relations: ['books', 'votes', 'user'], 
      where: {
        isDeleted: false,
      }
    })

    if(!reviewEntity || reviewEntity.books.id !== bookId) {
      throw new BadRequestException('not a valid book')
    }

    return reviewEntity;
  }

  public async createBookReview(bookId: string, review: CreateReviewDTO, userId: number): Promise<ResponseReviewDTO> {
    const findBook = await this.findOneBookOrFail(+bookId);
    const foundUser = await this.findOneUserOrFail(userId);

    if(foundUser.bookReviews.find(e => e.books.id === +bookId && !e.isDeleted)){
      throw new BadGatewayException('User already has review for the book');
    }

    const createBookReview = this.reviewsRepository.create(review);
    
    
    createBookReview.books = findBook;
    createBookReview.user = foundUser;

    const savedReview = await this.reviewsRepository.save(createBookReview);

    return this.transformer.toReturnReviewsDTO(savedReview);
  }

  public async updateBookReview(bookId: string, reviewId: string, review: CreateReviewDTO, userId: number): Promise<ResponseReviewDTO> {
   
    const book = await this.findOneBookOrFail(+bookId);
    const user = await this.findOneUserOrFail(userId);
    
    const reviewToUpdate = await this.reviewsRepository.findOne(reviewId, {
      where: {
        isDeleted: false,
      },
      relations: ['books', 'user'],
    });

    if (!reviewToUpdate) {
      throw new BadRequestException(
        `Review with id ${reviewId} does not exist!`,
      );
    }
    if (reviewToUpdate.user.id !== user.id) {
      throw new BadRequestException(`It is not written by you`);
    }

    if (book.id !== reviewToUpdate.books.id) {
      throw new BadRequestException('Thats not the correct book');
    } else {
      reviewToUpdate.content = review.content;
    }

    return this.transformer.toReturnReviewsDTO(await this.reviewsRepository.save(reviewToUpdate), true);
  }

  public async deleteBookReview(bookId: string, reviewId: string, userId: number): Promise<ResponseReviewDTO> {
    const findBook = await this.findOneBookOrFail(+bookId);
    const findUser = await this.findOneUserOrFail(userId);

    const reviewToDelete = await this.reviewsRepository.findOne(reviewId, {
      relations: ['books', 'user', "votes"],
    });

    if (findUser.id !== reviewToDelete.user.id) {
      throw new BadRequestException('You cannot delete that');
    }

    if (!reviewToDelete) {
      throw new BadRequestException('No review found');
    }
    if (findBook.id !== reviewToDelete.books.id) {
      throw new BadRequestException('This is not the correct book');
    }

    reviewToDelete.isDeleted = !reviewToDelete.isDeleted;

    reviewToDelete.votes.forEach(async e => {
      e.isDeleted = !e.isDeleted;
      await this.reviewsVoteRepository.save(e);
    })

    await this.reviewsRepository.save(reviewToDelete);

    return { id: reviewToDelete.id, content: reviewToDelete.content, isDeleted: reviewToDelete.isDeleted };
  }

  private async findOneBookOrFail(bookId: number) {
    try
    {
      const book = await this.booksRepository.findOne(bookId, {
        relations: ['reviews', 'reviews.books','reviews.user', 'borrower'],
      });
  
      return book;
    }
    catch(e)
    {
      throw new BadRequestException('There is no such a book.');
    }
  }

  private async findOneUserOrFail(userId: number) {
    try
    {
      const user = await this.usersRepository.findOneOrFail(userId, {
        relations: ['bookReviews', 'bookReviews.user', 'bookReviews.books'],
      });
  
      return user;

    }
    catch(e)
    {
      throw new BadRequestException('there is no such user');
    }
  }
}