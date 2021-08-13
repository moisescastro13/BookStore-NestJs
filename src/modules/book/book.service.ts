import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { RoleType, Status } from '../../Share/Enums';
import { User } from '../user/Entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dto';
import { Book } from './Entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(id: number): Promise<ReadBookDto> {
    if (!id) throw new BadRequestException();

    const book: Book = await this._bookRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!book) throw new NotFoundException();

    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: Status.ACTIVE },
    });
    return books.map((book: Book) => plainToClass(ReadBookDto, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) throw new BadRequestException();
    const author = await this._userRepository.findOne(authorId, {
      where: { status: Status.ACTIVE },
    });
    if (!author) throw new NotFoundException();
    const books: Book[] = await this._bookRepository.find({
      where: {
        status: Status.ACTIVE,
        authors: In([author]),
      },
    });
    return books.map(book => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];
    for (const authorId of book.authors) {
      const authorExist = await this._userRepository.findOne(authorId, {
        where: { status: Status.ACTIVE },
      });

      if (!authorExist)
        throw new NotFoundException(
          `Theres not author with this id: ${authorId}`,
        );

      const isAuthor = authorExist.roles.some(
        role => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor)
        throw new UnauthorizedException(
          `The user ${authorExist.username} is not an author`,
        );

      authors.push(authorExist);
    }
    const savedBook = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });
    return plainToClass(ReadBookDto, savedBook);
  }

  async createByAutor(
    book: Partial<CreateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: Status.ACTIVE },
    });

    if (!author) throw new NotFoundException();

    const isAutor = author.roles.map(role => role.name === RoleType.AUTHOR);

    if (!isAutor) throw new NotFoundException();

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });
    return plainToClass(ReadBookDto, savedBook);
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const bookExist: Book = await this._bookRepository.findOne(bookId, {
      where: { status: Status.ACTIVE },
    });
    if (!bookExist) throw new NotFoundException();

    const isOwnBook = bookExist.authors.some(author => author.id === authorId);

    if (!isOwnBook)
      throw new UnauthorizedException(`This user isn't the book's author`);

    const updatedBook = await this._bookRepository.update(bookId, book);
    return plainToClass(ReadBookDto, updatedBook);
  }

  async delete(id: number): Promise<void> {
    if (!id) throw new BadRequestException();

    const bookExist: Book = await this._bookRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!bookExist) throw new NotFoundException();

    await this._bookRepository.update(id, { status: Status.INACTIVE });
  }
}
