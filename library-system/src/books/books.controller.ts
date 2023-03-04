import {
  Controller,
  Get,
  UseGuards,
  Param,
  Put,
  Delete,
  Body,
  Post,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ReviewsService } from './reviews.service';
import { ResponseReviewDTO } from 'src/models/dtos/reviews-dtos/review.dto';
import { CreateReviewDTO } from 'src/models/dtos/reviews-dtos/create-review.dto';
import { AdminService } from 'src/admin/admin.service';
import { BookVoteService } from './book-vote.service';
import { CreateVoteDTO } from 'src/models/dtos/votes-dtos/create-vote.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/models/enums/user-roles';
import { BlacklistGuard } from 'src/auth/black-list.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReviewVoteService } from './review-vote.service';
import { BookDTO } from 'src/models/dtos/book-dtos/book.dto';
import { BookVoteDTO } from 'src/models/dtos/votes-dtos/book-vote.dto';
import { ReviewVoteDTO } from 'src/models/dtos/votes-dtos/review-vote.dto';

@Controller('api/books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly reviewsService: ReviewsService,
    private readonly adminService: AdminService,
    private readonly bookVoteService: BookVoteService,
    private readonly reviewVoteService: ReviewVoteService,
  ) {}

  //Get book -> [v]
  //Get 1 book -> [v]
  //Post book -> [v]
  //Change book -> [v]
  //Delete book -> [v]

  //Get book votes -> [v]
  //Get 1 book votes -> [v]
  //Post book vote -> [V]
  //Change book vote -> [V]
  //Delete book vote -> [V]

  //Get reviews -> [V]
  //Get 1 reviews -> [V]
  //Post reviews -> [V]
  //Change reviews -> [V]
  //Delete reviews -> [V]

  //Get review votes -> [v]
  //Get 1 review votes -> [v]
  //Post review vote -> [v]
  //Change review vote -> [V]
  //Delete review vote -> [V]

  //Get book
  @Get()
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async retrieveAllBooks(): Promise<BookDTO[]> {
    return await this.booksService.retrieveAllBooks();
  }

  //Get a book with
  @Get(':bookId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async viewIndividualBook(
    @Param('bookId') bookId: string,
  ): Promise<BookDTO> {
    return await this.booksService.viewIndividualBook(bookId);
  }

  @Post(':bookId/borrow')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async borrowABook(
    @Param('bookId') bookId: string,
    @Request() req
  ): Promise<BookDTO> {
    return await this.booksService.borrowBook(+bookId, req.user.sub);
  }

  @Delete(':bookId/borrow')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async returnABook(
    @Param('bookId') bookId: string,
    @Request() req
  ): Promise<BookDTO> {
    return await this.booksService.returnBook(+bookId, req.user.sub);
  }

  //Get book votes
  @Get('/:bookId/votes')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async getBookVotes(@Param('bookId') bookId: number): Promise<BookVoteDTO[]> {
    return await this.bookVoteService.getAllVotesFromBook(bookId);
  }

  //Get a book vote
  @Get('/:bookId/votes/:voteId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async getBookVote(@Param('bookId') bookId: number, @Param('voteId') voteId: number): Promise<BookVoteDTO> {
    return await this.bookVoteService.getVote(bookId, voteId);
  }

  @Post('/:bookId/votes')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async postBookVote(@Param('bookId') bookId: number, @Body() rate: CreateVoteDTO, @Request() req): Promise<BookVoteDTO> {
    return await this.bookVoteService.rateBook(bookId, rate, req.user.sub);
  }

  @Put("/:bookId/votes/:voteId")
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  async changeVote(@Param('bookId') bookId: number,@Param('voteId') voteId: number, @Body() rate: CreateVoteDTO, @Request() req): Promise<BookVoteDTO> {
    return await this.bookVoteService.changeVote(bookId, req.user.sub, +voteId, rate)
  }
  
  @Delete('/:bookId/votes/:voteId') 
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  async deleteVote(@Param('bookId') bookId: number,@Param('voteId') voteId: number, @Request() req): Promise<BookVoteDTO> {
    return await this.bookVoteService.deleteVote(bookId, req.user.sub, voteId);
  }

  @Get(':bookId/reviews')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async readBookReviews(
    @Param('bookId') bookId: string,
  ): Promise<ResponseReviewDTO[]> {
    return await this.reviewsService.readBookReviews(+bookId);
  }

  @Get('/:bookId/reviews/:reviewId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async getOneReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') revId: string,
  ): Promise<ResponseReviewDTO> {
    return await this.reviewsService.getOneReview(+bookId, +revId);
  }

  @Post(':bookId/reviews')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async createBookReview(
    @Param('bookId') bookId: string,
    @Body() review: CreateReviewDTO,
    @Request() req,
  ): Promise<ResponseReviewDTO> {
    return await this.reviewsService.createBookReview(bookId, review, req.user.sub);
  }

  @Put(':bookId/reviews/:reviewId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async updateBookReview(@Param('bookId') bookId: string, @Param('reviewId') reviewId: string, @Body() review: CreateReviewDTO, @Request() req): Promise<ResponseReviewDTO> {
    return await this.reviewsService.updateBookReview(bookId, reviewId, review, req.user.sub);
  }

  @Get('reviews/:reviewId/like')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async getIfUserLikedReview(@Param('reviewId') reviewId: string, @Request() req): Promise<boolean> {
    return await this.reviewVoteService.userIsLiked(+reviewId, req.user.sub);
  }

  @Get('reviews/:reviewId/dislike')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async getIfUserDislikedReview(@Param('reviewId') reviewId: string, @Request() req): Promise<boolean> {
    return await this.reviewVoteService.userIsDisliked(+reviewId, req.user.sub);
  }

  @Get('/:bookId/like')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async getIfUserLikedBook(@Param('bookId') bookId: string, @Request() req): Promise<boolean> {
    return await this.bookVoteService.userIsLiked(+bookId, req.user.sub);
  }

  @Get('/:bookId/dislike')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async getIfUserDislikedBook(@Param('bookId') bookId: string, @Request() req): Promise<boolean> {
    return await this.bookVoteService.userIsLiked(+bookId, req.user.sub);
  }

  @Delete(':bookId/reviews/:reviewId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async deleteBookReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Request() req
  ): Promise<ResponseReviewDTO> {
    return await this.reviewsService.deleteBookReview(bookId, reviewId, req.user.sub);
  }

  @Get(':bookId/reviews/:reviewId/votes')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  async getAllReviewVotes(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Request() req
  ): Promise<ReviewVoteDTO[]>{
    return await this.reviewVoteService.getAllVotesFromReview(+bookId, req.user.sub, +reviewId)
  }

  @Get(':bookId/reviews/:reviewId/votes/:voteId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  async getAReviewVote(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Param('voteId') voteId: string,
    @Request() req
  ): Promise<ReviewVoteDTO>{
    return await this.reviewVoteService.getAVoteFromReview(+bookId, req.user.sub, +reviewId, +voteId)
  }

  @Post(':bookId/reviews/:reviewId/votes')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async likeBookReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Body() reaction: CreateVoteDTO,
    @Request() req
  ): Promise<ReviewVoteDTO> {
    return await this.reviewVoteService.rateReview(+bookId, +reviewId, reaction, req.user.sub);
  }

  @Put(':bookId/reviews/:reviewId/votes/:voteId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async changeReviewVote(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Param('voteId') voteId: string,
    @Body() reaction: CreateVoteDTO,
    @Request() req
    ): Promise<ReviewVoteDTO> {
      return await this.reviewVoteService.changeVote(+bookId, req.user.sub, +reviewId, +voteId, reaction)
  }


  @Delete(':bookId/reviews/:reviewId/votes/:voteId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin, UserRole.Basic])
  )
  public async deleteReviewVote(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Param('voteId') voteId: string,
    @Request() req
    ): Promise<ReviewVoteDTO> {
      return await this.reviewVoteService.deleteVote(+bookId, +reviewId, req.user.sub, +voteId)
  }
}
