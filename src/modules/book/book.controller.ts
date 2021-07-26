import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './Entities/book.entity';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._bookService.getOne(id);
  }
  @Get()
  findAll() {
    return this._bookService.getAll();
  }
  @Post()
  newBook(book: Book) {
    return this._bookService.create(book.name);
  }
  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this._bookService.delete(id);
  }
}
