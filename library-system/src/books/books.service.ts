import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Books } from 'src/data/book.entity';
import { Repository } from 'typeorm';
import { TransformService } from 'src/transformer.service';
import { User } from 'src/data/user.entity';
import { BookDTO } from 'src/models/dtos/book-dtos/book.dto';

@Injectable() export class BooksService {
  constructor(
    @InjectRepository(Books)
    private readonly booksRepository: Repository<Books>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly transformer: TransformService,
  ) {}

  public async retrieveAllBooks(): Promise<BookDTO[]>{
    const allBooks = await this.booksRepository.find({
      where: {
        isDeleted: false,
      },
      relations: ['reviews', 'reviews.user', 'votes', 'borrower', 'votes.user'],
    });
    const result = allBooks.map(book => ({
      ...book,
      reviews: book.reviews.filter(rev => rev.isDeleted === false),
    }));
    return result.map(book => this.transformer.toBookResponseDTO(book));
  }

  public async viewIndividualBook(
    bookId: string,
  ): Promise<BookDTO> {
    try{
      const foundBook = await this.booksRepository.findOneOrFail(+bookId, {
        where: {
          isDeleted: false,
        },
        relations: ['reviews', 'reviews.user', 'votes', 'borrower', 'votes.user'],
      });
  
      const result = {
        ...foundBook,
        reviews: foundBook.reviews.filter(rev => !rev.isDeleted),
        votes: foundBook.votes.filter(rev => !rev.isDeleted),
      };
      return this.transformer.toBookResponseDTO(result);
    }catch(e){
      throw new BadRequestException(e.message)
    }

  }

  public async borrowBook(bookId: number, userId: number): Promise<BookDTO> {
    try{
      const foundBook = await this.booksRepository.findOneOrFail({
        where: {
          id: bookId,
          isBorrowed: false,
          isDeleted: false,
        },
        relations: ['borrower', 'reviews', 'reviews.books', 'reviews.user', 'reviews.votes', 'reviews.votes.reviews', 'reviews.votes.user'
        ,'votes', 'votes.book', 'votes.user' 
      ],
      });
      
      const userEntity = await this.userRepository.findOneOrFail(userId, {
        where: {
          isDeleted: false, 
          isBanned: false
        },
        relations: ['books']
      })
  
      foundBook.isBorrowed = true; foundBook.borrower = userEntity;

      const result = await this.booksRepository.save(foundBook);
      
      userEntity.books.push(result);
  
      await this.userRepository.save(userEntity);
      result.reviews = result.reviews.filter(e => !e.isDeleted)
      result.votes = result.votes.filter(e => !e.isDeleted)
      return this.transformer.toBookResponseDTO(result);
    }catch(e){
      throw new NotFoundException(e.message)
    }

  }

  public async returnBook(bookId: number, userId: number): Promise<BookDTO> {
    try{
      const foundBook = await this.booksRepository.findOneOrFail(+bookId, {
        where: {
          isDeleted: false,
        },
        relations: ['borrower', 'reviews', 'reviews.books', 'reviews.user', 'reviews.votes', 'reviews.votes.reviews', 'reviews.votes.user'
        ,'votes', 'votes.book', 'votes.user' 
      ],
      });

      const userEntity = await this.userRepository.findOneOrFail(userId, {
        relations: ['books'],
        where: {
          isDeleted: false,
          isBanned: false
        }
      })


      userEntity.books.splice(userEntity.books.findIndex((b) => foundBook.id === b.id), 1);

      foundBook.borrower = null;
      foundBook.isBorrowed = false;

      await this.userRepository.save(userEntity);
      const result = await this.booksRepository.save(foundBook);
      result.reviews = result.reviews.filter(e => !e.isDeleted)
      result.votes = result.votes.filter(e => !e.isDeleted)
      return this.transformer.toBookResponseDTO(result);
    }catch(e){
      // if(e instanceof BadRequestException)
        throw e;
      throw new NotFoundException(e.message)
    }
  }
}
