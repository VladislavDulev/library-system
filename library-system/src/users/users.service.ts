import { Injectable, BadGatewayException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data/user.entity';
import { Repository } from 'typeorm';
import { TransformService } from 'src/transformer.service';
import { ResponseUserDTO } from 'src/models/dtos/users-dtos/response-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/models/dtos/users-dtos/create-user.dto';
import { Limits } from 'src/models/enums/limits';
import { Books } from 'src/data/book.entity';
import { BookVoteService } from 'src/books/book-vote.service';
import { BookVote } from 'src/data/votes/book-votes.entity';
import { ReviewVote } from 'src/data/votes/review-vote.entity';
import { Reviews } from 'src/data/review.entity';
import { BookDTO } from 'src/models/dtos/book-dtos/book.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Books) private readonly bookRepo: Repository<Books>,
    @InjectRepository(BookVote) private readonly bookVoteRepo: Repository<BookVote>,
    @InjectRepository(ReviewVote) private readonly reviewVoteRepo: Repository<ReviewVote>,
    @InjectRepository(Reviews) private readonly reviewRepo: Repository<Reviews>,
    private readonly transformer: TransformService,
  ) {}

  async create(userDto: CreateUserDTO): Promise<ResponseUserDTO> {
    if(userDto.password !== userDto.repeatpassword) {
      throw new BadGatewayException('Passwords do not match');
    }
    const user = this.usersRepository.create({
      username: userDto.username,
      password: await bcrypt.hash(userDto.password, Limits.HASH_ROUNDS),
    });

    const created = await this.usersRepository.save(user);

    return this.transformer.toResponseUserDTO(created, true);
  }

  public async getBorrowedUserBooks(userId: number): Promise<BookDTO[]> {
    try
    {
      const user = await this.usersRepository.findOneOrFail(userId, {
        where: {
          isBanned: false,
          isDeleted: false,
        },
        relations:['books']
      })

      return user.books.map(b => this.transformer.toBookResponseDTO(b, true));
    }
    catch(e)
    {
      throw new NotFoundException("Not found user");
    }
  }

  public async banUser(userId: number) {
    const user = await this.findUserOrFail(userId);

    user.isBanned = !user.isBanned;

    return this.transformer.toResponseUserDTO(await this.usersRepository.save(user), true);
  }

  public async deleteUser(userId: number) {
    const user = await this.usersRepository.findOneOrFail(userId, {
      relations: ['books', 'booksVotes', 'reviewVotes', 'bookReviews'],
    });
    
    user.isDeleted = !user.isDeleted;

    if(user.isDeleted)
      user.books.forEach(async e => {
        e.borrower = null;
        e.isBorrowed = false;
        await this.bookRepo.save(e);
      })

    user.bookReviews.forEach(async e => {
      e.isDeleted = user.isDeleted;
      await this.reviewRepo.save(e);
    })

    user.booksVotes.forEach(async e => {
      e.isDeleted = user.isDeleted;
      await this.bookVoteRepo.save(e);
    })

    user.reviewVotes.forEach(async e => {
      e.isDeleted = user.isDeleted;
      await this.reviewVoteRepo.save(e);
    })


    return this.transformer.toResponseUserDTO(await this.usersRepository.save(user), true);
  }

  private async findUserOrFail(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new Error('No user!');
    }
    return user;
  }
}
