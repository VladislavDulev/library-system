import { UserDTO } from '../users-dtos/user.dto';
import { Reaction } from 'src/models/enums/reactions';
import { BookDTO } from '../book-dtos/book.dto';
import { ResponseUserDTO } from '../users-dtos/response-user.dto';

export class BookVoteDTO {
  id: number;

  user: ResponseUserDTO;

  book?: BookDTO;

  reaction: Reaction;
}
