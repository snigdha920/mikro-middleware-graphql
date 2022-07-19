import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Field, ObjectType } from '@nestjs/graphql';
import { BookRepository } from './book.repository';

@ObjectType()
@Entity({ customRepository: () => BookRepository })
export class Book {
  @PrimaryKey()
  @Field()
  public _id!: ObjectId;

  @Property()
  @Field()
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}
