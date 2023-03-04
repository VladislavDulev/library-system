import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/data/user.entity';
import { TransformService } from 'src/transformer.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Books } from 'src/data/book.entity';
import { BookVote } from 'src/data/votes/book-votes.entity';
import { ReviewVote } from 'src/data/votes/review-vote.entity';
import { Reviews } from 'src/data/review.entity';
import { ReviewsService } from 'src/books/reviews.service';
import { ReviewVoteService } from 'src/books/review-vote.service';
import { BookVoteService } from 'src/books/book-vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Books, BookVote, ReviewVote, Reviews]), 
  AuthModule,
  PassportModule,
   
  ], 
  controllers: [UsersController],
  providers: [UsersService, TransformService, ReviewsService, ReviewVoteService, BookVoteService],
})
export class UsersModule {}
