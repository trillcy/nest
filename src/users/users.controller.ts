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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  PaginatorUserViewDto,
  QueryUserInputDto,
  UserInputDto,
  UserViewDto,
} from './users.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
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
    const { login, email, password } = userInput;

    const isUserExist = async (login: string, email: string) => {
      const userLogin = await this.usersService.findByLogin(login);
      if (userLogin)
        throw new BadRequestException([
          { message: 'user exists', field: 'login' },
        ]);
      const userEmail = await this.usersService.findByEmail(email);
      if (userEmail)
        throw new BadRequestException([
          { message: 'user exists', field: 'email' },
        ]);
    };
    await isUserExist(login, email);
    const result = await this.usersService.createUser(userInput);
    console.log('21--user', result);
    return result;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!id) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    // возвращает удаленный объект
    // или null если не найдет его
    const result = await this.usersService.remove(id);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }
}
