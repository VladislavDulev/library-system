import { IsNotEmpty, IsString, Length, IsUrl } from 'class-validator';
import { Limits } from 'src/models/enums/limits';

export class CreateBookDTO {
  @IsNotEmpty()
  @Length(Limits.MIN_BOOK_TITLE_LENGTH, Limits.MAX_BOOK_TITLE_LENGTH)
  @IsString()
  title: string;

  @IsString()
  @Length(Limits.MIN_BOOK_CONTENT_LENGTH, Limits.MAX_BOOK_CONTENT_LENGTH)
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  coverURL: string;
}
