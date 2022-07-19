import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Book } from './book.entity';
import { BookService } from './book.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Book] })],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
