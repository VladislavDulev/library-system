import { IsString, Length, IsUrl } from 'class-validator';
import { Limits } from 'src/models/enums/limits';

export class ChangeBookDTO {
  @IsString()
  @Length(Limits.MIN_BOOK_TITLE_LENGTH, Limits.MAX_BOOK_TITLE_LENGTH)
  title?: string;

  @IsString()
  @Length(Limits.MIN_BOOK_CONTENT_LENGTH, Limits.MAX_BOOK_CONTENT_LENGTH)
  content?: string;

  @IsString()
  @IsUrl()
  coverURL?: string;
}
