import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseUserDTO } from 'src/models/dtos/users-dtos/response-user.dto';
import { CreateUserDTO } from 'src/models/dtos/users-dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlacklistGuard } from 'src/auth/black-list.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/models/enums/user-roles';
import { ReviewsService } from 'src/books/reviews.service';
import { ReviewVoteService } from 'src/books/review-vote.service';
import { BookVoteService } from 'src/books/book-vote.service';
import { Vote } from 'src/data/votes/vote.entity';
import { ReviewVoteDTO } from 'src/models/dtos/votes-dtos/review-vote.dto';
import { BookVoteDTO } from 'src/models/dtos/votes-dtos/book-vote.dto';

//Migrate most of the admin paths to user
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly reviewService: ReviewsService,
    private readonly voteReviewRepo: ReviewVoteService,
    private readonly voteBookRepo: BookVoteService,
  ) {}

  @Post()
  public async createUser(
    @Body(new ValidationPipe({ whitelist: true }))
    userDto: CreateUserDTO,
  ): Promise<ResponseUserDTO> {
    return await this.userService.create(userDto);
  }

    @Post(':userId/ban')
    @UseGuards(
      JwtAuthGuard,
      BlacklistGuard,
      new RolesGuard([UserRole.Admin])
    )
    async banUser(@Param('userId') userId: string) {
      return await this.userService.banUser(+userId)
    }


    @Get(':userId/books')
    @UseGuards(
      JwtAuthGuard,
      BlacklistGuard,
      new RolesGuard([UserRole.Basic, UserRole.Admin])
    )
    async getBorrowedBooksByUser(@Param('userId') userId: string) {
      return await this.userService.getBorrowedUserBooks(+userId)
    }

    @Get(':userId/reviews')
    @UseGuards(
      JwtAuthGuard,
      BlacklistGuard,
      new RolesGuard([UserRole.Basic, UserRole.Admin])
    )
    async getReviewsByUser(@Param('userId') userId: string) {
      return await this.reviewService.readBookReviewsFromUser(+userId)
    }

    @Get(':userId/reviews/:reviewId/vote')
    @UseGuards(
      JwtAuthGuard,
      BlacklistGuard,
      new RolesGuard([UserRole.Basic, UserRole.Admin])
    )
    async getVoteFromUserForReview(@Param('userId') userId: string, @Param('reviewId') reviewId: string): Promise<[boolean, ReviewVoteDTO]> {
      return await this.voteReviewRepo.userHasVoteForReview(+reviewId, +userId);
    }

    @Get(':userId/books/:bookId/vote')
    @UseGuards(
      JwtAuthGuard,
      BlacklistGuard,
      new RolesGuard([UserRole.Basic, UserRole.Admin])
    )
    async getVoteFromUserForBook(@Param('userId') userId: string, @Param('bookId') bookId: string): Promise<[boolean, BookVoteDTO]> {
      return await this.voteBookRepo.userHasVoteForBook(+bookId, +userId);
    }

    @Delete(':userId/')
    @UseGuards(
      JwtAuthGuard,
      BlacklistGuard,
      new RolesGuard([UserRole.Admin])
    )
    async deleteUser(@Param('userId') userId: string) {
      return await this.userService.deleteUser(+userId)
    }
}
