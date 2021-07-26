import { EntityRepository, Repository } from 'typeorm';
import { Book } from './Entities/book.entity';
@EntityRepository(Book)
export class BookRepository extends Repository<Book> {}
