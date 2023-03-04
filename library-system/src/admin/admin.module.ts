import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from 'src/data/book.entity';
import { Reviews } from 'src/data/review.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TransformService } from 'src/transformer.service';
import { BookVote } from 'src/data/votes/book-votes.entity';
import { User } from 'src/data/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Books, Reviews, BookVote, User]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService, TransformService],
})
export class AdminModule {}
