import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatDto } from './Dto/cats.dto';
import { ICat } from './interfaces/cats.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly _catService: CatsService) {}
  @Post()
  NewCat(@Body() cat: CatDto) {
    return this._catService.create(cat);
  }

  @Get()
  async findAll(): Promise<ICat[]> {
    return this._catService.findAll();
  }
}
