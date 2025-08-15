import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('entity')
export class EntityController {
  constructor() {}

  @Get('info')
  findAll(): string {
    return 'info';
  }

}
