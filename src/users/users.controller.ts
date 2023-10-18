import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import {
  PaginatorUserViewDto,
  QueryUserInputDto,
  UserInputDto,
  UserViewDto,
} from './users.dto';
import { UsersService } from './users.service';

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
  remove(@Param('id') id: string): Promise<UserViewDto | null> {
    // возвращает удаленный объект
    // или null если не найдет его
    return this.usersService.remove(id);
  }
}
