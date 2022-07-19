import { EntityRepository } from '@mikro-orm/mongodb';
import { Book } from './book.entity';

export class BookRepository extends EntityRepository<Book> {}
