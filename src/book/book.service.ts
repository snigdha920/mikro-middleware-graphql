import { ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    protected readonly bookRepository: BookRepository,
  ) {}

  async createBook() {
    this.bookRepository.create({ _id: new ObjectId(), title: '' });
  }
}
