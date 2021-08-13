import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from 'src/Share/Enums';
import { GetUser } from '../auth/user.decorator';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dto';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ReadBookDto> {
    return this._bookService.get(id);
  }
  @Get()
  findAll(): Promise<ReadBookDto[]> {
    return this._bookService.getAll();
  }

  @Get('author/:authorId')
  getBookByAuthor(
    @Param('id', ParseIntPipe) AuthorId: number,
  ): Promise<ReadBookDto[]> {
    return this._bookService.getBookByAuthor(AuthorId);
  }

  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  newBook(@Body() book: Partial<CreateBookDto>) {
    return this._bookService.create(book);
  }

  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  newBookByAuthor(
    @Body() book: Partial<CreateBookDto>,
    @GetUser('id') authorId: number,
  ) {
    return this._bookService.createByAutor(book, authorId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() book: Partial<UpdateBookDto>,
    @GetUser('id') authorId: number,
  ) {
    return this._bookService.update(id, book, authorId);
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this._bookService.delete(id);
  }
}
