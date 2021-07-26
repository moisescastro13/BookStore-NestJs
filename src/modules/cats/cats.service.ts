import { Injectable } from '@nestjs/common';
import { ICat } from './interfaces/cats.interface';

@Injectable()
export class CatsService {
  private Cats: ICat[] = [];

  create(cat: ICat) {
    return this.Cats.push(cat);
  }

  findAll(): ICat[] {
    return this.Cats;
  }
}
