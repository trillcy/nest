import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  PaginatorUserViewDto,
  QueryUserInputDto,
  UserInputDto,
  UserViewDto,
} from './users.dto';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query() query: QueryUserInputDto,
  ): Promise<PaginatorUserViewDto> {
    const result = await this.usersService.getAll(query);
    console.log('9--user.getAll', result);
    return result;
  }

  @Post()
  async createUser(
    @Body() userInput: UserInputDto,
  ): Promise<UserViewDto | null> {
    const result = await this.usersService.createUser(userInput);
    console.log('21--user', result);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    if (!id) res.sendStatus(HttpStatus.NOT_FOUND); //404
    // возвращает удаленный объект
    // или null если не найдет его
    const result = this.usersService.remove(id);
    if (!result) res.sendStatus(HttpStatus.NOT_FOUND); //404
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }
}
