import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/data/book.entity';
import { Repository } from 'typeorm';
import { Reviews } from 'src/data/review.entity';
import { CreateBookDTO } from 'src/models/dtos/book-dtos/create-book.dto';
import { BookDTO } from 'src/models/dtos/book-dtos/book.dto';
import { TransformService } from 'src/transformer.service';
import { ChangeBookDTO } from 'src/models/dtos/book-dtos/change-book.dto';
import { BookVote } from 'src/data/votes/book-votes.entity';
import { UserDTO } from 'src/models/dtos/users-dtos/user.dto';
import { User } from 'src/data/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Books)
    private readonly booksRepository: Repository<Books>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
    @InjectRepository(BookVote)
    private readonly bookVoteRepo: Repository<BookVote>, 
    private readonly transformer: TransformService
  ) {}

  async getAllBooks(): Promise<BookDTO[]> {
    const books = await this.booksRepository.find({
      relations: ['reviews', 'reviews.user', 'votes', 'votes.user', 'borrower'],
    });
    return books.map(b => this.transformer.toBookResponseDTO(b));
  }
  async getOneBook(bookId: number): Promise<BookDTO> {
    try{
      const book = await this.booksRepository.findOneOrFail(bookId, {
        relations: ['reviews', 'reviews.user', 'votes', 'votes.user', 'borrower']
      });

      return this.transformer.toBookResponseDTO(book);
    }catch(e){
      throw new BadRequestException(e.message)
    }
  }
  async createOneBook(book: CreateBookDTO): Promise<BookDTO> {
    const createBook = await this.booksRepository.create(book);
    const createdBook = await this.booksRepository.save(createBook);

    return this.transformer.toBookResponseDTO(createdBook, true);
  }
  async updateOneBook(
    bookId: number,
    book: ChangeBookDTO,
  ): Promise<BookDTO> {
    try{
      const bookToUpdate = await this.booksRepository.findOneOrFail(bookId);
      
      const updatedBook = await this.booksRepository.save({
        ...bookToUpdate,
        ...book,
      });

      return this.transformer.toBookResponseDTO(updatedBook, true);

    }catch(e){

      throw new BadRequestException(e.message)

    }
  }
  async deleteOneBook(bookId: number): Promise<BookDTO> {
    try{
      const bookToDelete = await this.booksRepository.findOneOrFail(bookId, {
        relations: ['borrower', "reviews", "votes", "votes.user"]
      });

      bookToDelete.borrower = null;

      bookToDelete.reviews.forEach(async element => {
        element.isDeleted = !element.isDeleted;
        await this.reviewsRepository.save(element);
      });

      bookToDelete.votes.forEach(async element => {
        element.isDeleted = !element.isDeleted;
        await this.bookVoteRepo.save(element);
      });

      bookToDelete.isDeleted = !bookToDelete.isDeleted;
      await this.booksRepository.save(bookToDelete);
      return this.transformer.toBookResponseDTO(bookToDelete);
    }catch(e){
      throw new BadRequestException(e.message)
    }
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.find({
      relations: ['books', 'bookReviews', 'bookReviews.user', 'booksVotes', 'booksVotes.user', 'reviewVotes', 'reviewVotes.user'],
    });
    return users.map(e => this.transformer.toResponseUserDTO(e));
  }
}
