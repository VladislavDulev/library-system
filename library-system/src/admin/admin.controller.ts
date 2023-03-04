import { Controller, Get, UseGuards, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateBookDTO } from 'src/models/dtos/book-dtos/create-book.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/models/enums/user-roles';
import { ChangeBookDTO } from 'src/models/dtos/book-dtos/change-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlacklistGuard } from 'src/auth/black-list.guard';
import { BookDTO } from 'src/models/dtos/book-dtos/book.dto';
import { UserDTO } from 'src/models/dtos/users-dtos/user.dto';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('books')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin])
  )
  public async getAllBooks(): Promise<BookDTO[]> {
    return await this.adminService.getAllBooks();
  }

  @Get('books/:bookId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin])
  )
  public async getOneBook(
    @Param('bookId') bookId: string,
  ): Promise<BookDTO> {
    return await this.adminService.getOneBook(+bookId);
  }

  @Post('books')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin])
  )
  public async createOneBook(
    @Body() book: CreateBookDTO,
  ): Promise<BookDTO> {
    return await this.adminService.createOneBook(book);
  }

  @Put('books/:bookId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin])
  )
  public async updateOneBook(
    @Param('bookId') bookId: string,
    @Body() book: ChangeBookDTO,
  ): Promise<BookDTO> {
    return await this.adminService.updateOneBook(+bookId, book);
  }

  @Delete('books/:bookId')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin])
  )
  public async deleteOneBook(
    @Param('bookId') bookId: string,
  ): Promise<BookDTO> {
    return await this.adminService.deleteOneBook(+bookId);
  }

  @Get('users')
  @UseGuards(
    JwtAuthGuard,
    BlacklistGuard,
    new RolesGuard([UserRole.Admin])
  )
  public async getAllUsers(): Promise<UserDTO[]> {
    return await this.adminService.getAllUsers();
  }
}
