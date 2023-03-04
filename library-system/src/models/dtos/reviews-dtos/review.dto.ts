import { ResponseUserDTO } from "../users-dtos/response-user.dto";
import { BookDTO } from "../book-dtos/book.dto";

export class ResponseReviewDTO {
  id: number;

  content: string;

  user?: ResponseUserDTO;

  book?: BookDTO;

  isDeleted: boolean;
}
