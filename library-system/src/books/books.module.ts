import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from 'src/data/book.entity';
import { Reviews } from 'src/data/review.entity';
import { User } from 'src/data/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TransformService } from 'src/transformer.service';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';
import { BookVoteService } from './book-vote.service';
import { BookVote } from 'src/data/votes/book-votes.entity';
import { ReviewVoteService } from './review-vote.service';
import { ReviewVote } from 'src/data/votes/review-vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Books, Reviews, User, BookVote, ReviewVote]), AuthModule ,AdminModule],
  controllers: [BooksController],
  providers: [BooksService, ReviewsService, TransformService, AdminService, BookVoteService, ReviewVoteService],
})
export class BooksModule {}
