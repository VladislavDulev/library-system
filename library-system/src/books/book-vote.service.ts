import { Injectable, BadGatewayException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookVote } from 'src/data/votes/book-votes.entity';
import { Repository } from 'typeorm';
import { Books } from 'src/data/book.entity';
import { User } from 'src/data/user.entity';
import { TransformService } from 'src/transformer.service';
import { CreateVoteDTO } from 'src/models/dtos/votes-dtos/create-vote.dto';
import { BookVoteDTO } from 'src/models/dtos/votes-dtos/book-vote.dto';
import { Reaction } from 'src/models/enums/reactions';
import { Vote } from 'src/data/votes/vote.entity';

@Injectable()
export class BookVoteService {
    constructor(
        @InjectRepository(BookVote)
        private readonly voteRepo: Repository<BookVote>,
        @InjectRepository(Books)
        private readonly booksRepository: Repository<Books>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly transform: TransformService
    ){}
    //Get votes -> [V]
    //Post vote -> [V]
    //Change vote -> [V]
    //Delete vote -> [V]

    //TO-DO Transfortm to BookVoteDTO
    public async rateBook(bookId: number, rate: CreateVoteDTO, userId: number): Promise<BookVoteDTO> {
        try{
            const ratedBook = await this.booksRepository.findOneOrFail(bookId, {
                relations: ['votes', 'votes.user', 'votes.book'],
                where: {
                    isDeleted: false
                }
            });

            if(ratedBook.votes.filter(e => !e.isDeleted).find(e => e.user.id === userId)){
                throw new BadGatewayException('User already has a vote for the book')
            }
            
            const userEntity = await this.userRepository.findOneOrFail(userId,  {
                relations: ['booksVotes'],
                where: {
                    isDeleted: false,
                    isBanned: false
                }
            });

            const vote = await this.voteRepo.create({
                user: userEntity,
                book: ratedBook,
                reaction: rate.reaction
            })

            ratedBook.votes.push(vote);
            userEntity.booksVotes.push(vote);
        
            await this.userRepository.save(userEntity);
        
            await this.booksRepository.save(ratedBook);
            
            return this.transform.toBookVoteDTO(await this.voteRepo.save(vote), true);
        }catch(e){
            throw new NotFoundException(e.message);
        }
    }
    public async getAllVotesFromBook(bookId: number): Promise<BookVoteDTO[]> {
        try{
            const book = await this.booksRepository.findOneOrFail(bookId, {
                relations: ['votes', "votes.user", 'votes.book'],
                where: {
                    isDeleted: false
                }
            })
    
            return book.votes.filter(e => !e.isDeleted).map(v => this.transform.toBookVoteDTO(v));
        }catch(e){
            throw new NotFoundException(e.message);
        }
    }

    public async getVote(bookId: number, voteId: number): Promise<BookVoteDTO> {
        try{
            const voteEntity = await this.voteRepo.findOneOrFail(+voteId, {
                relations: ['book', 'user'],
                where: {
                    isDeleted: false
                }
            })

            if(voteEntity.book.id !== +bookId) {
                throw new BadGatewayException('book with that vote does not exist')
            }

            return this.transform.toBookVoteDTO(voteEntity);
        }catch(e){
            throw new NotFoundException(e.message);
        }
    }

    public async changeVote(bookId: number, userId: number, voteId: number, vote: CreateVoteDTO): Promise<BookVoteDTO> {
        try{
            const voteEntity = await this.voteRepo.findOneOrFail(voteId, {
                relations: ['book', 'user'],
                where: {
                    isDeleted: false
                }
            });
    
            if(voteEntity.book.id !== +bookId || voteEntity.user.id !== +userId) {
                throw new BadGatewayException('not a valid vote');
            }
    
            voteEntity.reaction = vote.reaction;
            await this.voteRepo.save(voteEntity)
            return this.transform.toBookVoteDTO(voteEntity);
        }
        catch(e){
            throw new BadGatewayException(e.message)
        }
    }

    public async deleteVote(bookId: number, userId: number, voteId: number): Promise<BookVoteDTO> {
        try
        {
            const voteEntity = await this.voteRepo.findOne(voteId, {
                relations: ['book', 'user'],
                
            });
    
            if(voteEntity.book.id !== +bookId || voteEntity.user.id !== +userId) {
                throw new BadGatewayException('not a valid vote');
            }
    
            voteEntity.isDeleted = !voteEntity.isDeleted
            await this.voteRepo.save(voteEntity);
            return this.transform.toBookVoteDTO(voteEntity);
        }
        catch(e)
        {
            throw new BadGatewayException(e.message)
        }
    }

    public async userIsDisliked(bookId: number, userId: number): Promise<boolean> {
        const [hasVote, vote] = await this.userHasVoteForBook(bookId, userId);

        if(hasVote){
            return vote.reaction === Reaction.Dislike;
        }
        return hasVote;
    }

    public async userIsLiked(reviewId: number, userId: number): Promise<boolean> {
        const [hasVote, vote] = await this.userHasVoteForBook(reviewId, userId);

        if(hasVote){
            return vote.reaction === Reaction.Like;
        }
        return hasVote;
    }

    public async userHasVoteForBook(bookId: number, userId: number): Promise<[boolean, BookVoteDTO]> {
        try
        {
            const user = await this.userRepository.findOneOrFail(userId, {
                where: {
                    isDeleted: false,
                }, relations:['booksVotes', 'booksVotes.user', 'booksVotes.book']
            })
            const book = await this.booksRepository.findOneOrFail(bookId, {
                where: {
                    isDeleted: false
                },
                relations: ['votes', 'votes.book', 'votes.user']
            })

            const vote = user.booksVotes.find(e => e.book.id === book.id && e.isDeleted);

            if(vote){
                return [true, this.transform.toBookVoteDTO(vote, true)];
            }
            return [false, null];
        }
        catch(e)
        {
            throw new NotFoundException(e.message);
        }
    }

}
