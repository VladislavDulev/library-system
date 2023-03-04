import { Reaction } from 'src/models/enums/reactions';
import { ResponseUserDTO } from '../users-dtos/response-user.dto';
import { ResponseReviewDTO } from '../reviews-dtos/review.dto';

export class ReviewVoteDTO {
  id: number;

  isDeleted: boolean;

  user: ResponseUserDTO;

  review?: ResponseReviewDTO;

  reaction: Reaction;
}
