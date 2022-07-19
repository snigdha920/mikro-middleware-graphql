import { Injectable } from '@nestjs/common';
import { BookService } from './book/book.service';

@Injectable()
export class AppService {
  constructor(protected readonly bookService: BookService) {}
  async createBook() {
    this.bookService.createBook();
  }
}
