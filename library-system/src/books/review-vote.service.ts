import { Injectable, BadGatewayException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookVote } from 'src/data/votes/book-votes.entity';
import { Repository } from 'typeorm';
import { Books } from 'src/data/book.entity';
import { User } from 'src/data/user.entity';
import { TransformService } from 'src/transformer.service';
import { CreateVoteDTO } from 'src/models/dtos/votes-dtos/create-vote.dto';
import { JwtPayload } from 'src/common/jwt-payload';
import { ReviewVote } from 'src/data/votes/review-vote.entity';
import { Reviews } from 'src/data/review.entity';
import { ReviewVoteDTO } from 'src/models/dtos/votes-dtos/review-vote.dto';
import { Reaction } from 'src/models/enums/reactions';
import { Vote } from 'src/data/votes/vote.entity';

@Injectable()
export class ReviewVoteService {
    constructor(
        @InjectRepository(ReviewVote)
        private readonly voteRepo: Repository<ReviewVote>,
        @InjectRepository(Reviews)
        private readonly reviewRepo: Repository<Reviews>,
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
    public async rateReview(bookId: number, reviewId: number, rate: CreateVoteDTO, userId: number ): Promise<ReviewVoteDTO> {
        try{
            const existingReviews= (await (await this.getAllVotesFromReview(bookId, userId, reviewId)).filter(e => !e.isDeleted))

            if(existingReviews.find(e => e.user.id === userId)){
                throw new BadGatewayException('User already has a vote for review.')
            }
            const reviewEntity = await this.reviewRepo.findOneOrFail(reviewId, {
                relations: ['books', 'votes']
            })
    
            const userEntity = await this.userRepository.findOneOrFail(userId, {
                relations: ['reviewVotes']
            });
    
            const vote = await this.voteRepo.create({
                user: userEntity,
                reviews: reviewEntity,
                reaction: rate.reaction
            })
    
            reviewEntity.votes.push(vote);
            userEntity.reviewVotes.push(vote);
    
            await this.userRepository.save(userEntity);
            await this.reviewRepo.save(reviewEntity);
            const result = await this.voteRepo.save(vote);

            return this.transform.toReviewVoteDTO(result, true);
        }
        catch(e){
            if(e instanceof BadGatewayException){
                throw e;
            }
            throw new NotFoundException(e.message);
        }
    }

    public async getAllVotesFromUser(userId: number): Promise<ReviewVoteDTO[]> {
        try
        {
            const user = await this.userRepository.findOneOrFail(userId, {
                relations: ['reviewVotes', "reviewVotes.user", "reviewVotes.reviews"]
            })
    
            return user.reviewVotes.map(e => this.transform.toReviewVoteDTO(e));
        }
        catch(e)
        {
            throw new NotFoundException(e.message);
        }
    }

    public async getAllVotesFromReview(bookId: number, userId: number, reviewId: number): Promise<ReviewVoteDTO[]> {
        try
        {
            const review = await this.reviewRepo.findOneOrFail(reviewId, {
                relations: ['votes', 'books', 'user', "votes.user", "votes.reviews"]
            })
            
            if(review.books.id !== bookId) {
                throw new BadGatewayException('not a valid vote');
            }
    
            return review.votes.map(e => this.transform.toReviewVoteDTO(e, true));
        }
        catch(e)
        {
            if(e instanceof BadGatewayException)
                throw e;
            throw new NotFoundException(e.message);
        }
    }

    public async getAVoteFromReview(bookId: number, userId: number, reviewId: number, voteId: number): Promise<ReviewVoteDTO> {
        try
        {
            const voteEntity = await this.voteRepo.findOneOrFail(voteId, {
                relations: ['reviews', 'reviews.user', 'reviews.books', 'user'],
            });
    
            if(voteEntity.reviews.books.id !== bookId || voteEntity.reviews.id !== reviewId || voteEntity.user.id !== userId) {
                throw new BadGatewayException('not a valid vote');
            }
    
            return this.transform.toReviewVoteDTO(voteEntity);
        }
        catch(e)
        {
            if(e instanceof BadGatewayException)
                throw e;
            throw new NotFoundException(e.message);
        }
    }

    public async changeVote(bookId: number, userId: number, reviewId: number, voteId: number, vote: CreateVoteDTO): Promise<ReviewVoteDTO> {
        try{
            const voteEntity = await this.voteRepo.findOneOrFail(voteId, {
                relations: ['reviews', 'reviews.user', 'reviews.books', 'user'],
            });
            console.log('change vote')
            if(voteEntity.reviews.books.id !== bookId || voteEntity.reviews.id !== reviewId) {
                throw new BadGatewayException('not a valid vote');
            }
    
            voteEntity.reaction = vote.reaction;
            const result = await this.voteRepo.save(voteEntity);
            
            return this.transform.toReviewVoteDTO(result);
        }catch(e){
            if(e instanceof BadGatewayException)
                throw e;
            throw new NotFoundException(e.message);
        }
    }

    public async deleteVote(bookId: number, reviewId: number, userId: number, voteId: number): Promise<ReviewVoteDTO> {
        try
        {
            const voteEntity = await this.voteRepo.findOneOrFail(voteId, {
                relations: ['reviews', 'reviews.user', 'reviews.books', 'user'],
            });
    
            if(voteEntity.reviews.books.id !== bookId || voteEntity.reviews.id !== reviewId) {
                throw new BadGatewayException('not a valid vote');
            }
    
            voteEntity.isDeleted = !voteEntity.isDeleted
            const result = await this.voteRepo.save(voteEntity);
            return this.transform.toReviewVoteDTO(result, true);
        }
        catch(e)
        {
            if(e instanceof BadGatewayException)
                throw e;
            throw new NotFoundException(e.message);
        }
    }

    public async userIsDisliked(reviewId: number, userId: number): Promise<boolean> {
        const [hasVote, vote] = await this.userHasVoteForReview(reviewId, userId);

        if(hasVote){
            return vote.reaction === Reaction.Dislike;
        }
        return hasVote;
    }

    public async userIsLiked(reviewId: number, userId: number): Promise<boolean> {
        const [hasVote, vote] = await this.userHasVoteForReview(reviewId, userId);

        if(hasVote){
            return vote.reaction === Reaction.Like;
        }
        return hasVote;
    }

    public async userHasVoteForReview(reviewId: number, userId: number): Promise<[boolean, ReviewVoteDTO]> {
        try
        {
            const user = await this.userRepository.findOneOrFail(userId, {
                where: {
                    isDeleted: false,
                }, relations:['reviewVotes', 'reviewVotes.user', 'reviewVotes.reviews']
            })
            console.log(reviewId)
            const review = await this.reviewRepo.findOneOrFail(reviewId, {
                where: {
                    isDeleted: false
                }
            })
            const vote = user.reviewVotes.find(e => e.reviews.id === review.id && !e.isDeleted)

            if(vote){
                return [true, this.transform.toReviewVoteDTO(vote, true)];
            }
            return [false, null];
        }
        catch(e)
        {
            throw new NotFoundException(e.message);
        }
    }

}
