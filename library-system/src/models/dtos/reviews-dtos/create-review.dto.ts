import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Limits } from 'src/models/enums/limits';

export class CreateReviewDTO {
  @IsString()
  @IsNotEmpty()
  @Length(Limits.MIN_REVIEW_LENGTH, Limits.MIN_REVIEW_LENGTH)
  content: string;
}
