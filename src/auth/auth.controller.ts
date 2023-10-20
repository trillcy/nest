import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInputDto, UserViewDto } from 'src/users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  async registration(@Body() userInput: UserInputDto): Promise<any> {
    const { login, email, password } = userInput;

    const emailSuccess = await this.authService.registration(
      login,
      email,
      password,
    );

    if (emailSuccess) {
      return emailSuccess;
    } else {
      // return res.sendStatus(444);
    }
  }
}
