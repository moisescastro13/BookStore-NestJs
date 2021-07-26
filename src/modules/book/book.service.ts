import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
  ) {}
  private books: string[] = ['Dracula', 'La revolucion Rusa'];

  getOne(id: number) {
    const book = this.books.filter((ele, index) =>
      ele ? index == id : index != id,
    );
    if (!book) {
      throw new NotFoundException();
    }
    return book;
  }

  getAll() {
    return this.books;
  }

  create(book: string) {
    return this.books.push(book);
  }

  delete(id: number) {
    return this.books.splice(id, 1);
  }
}
