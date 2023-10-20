import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly usersService: UsersService,
  ) {}
  const emailConfirmation: {
    confirmationCode: uuidv4(),
    expirationDate: add(date, { hours: 1, minutes: 3 }),
    isConfirmed: false,
  },
  const passwordConfirmation: {
    confirmationCode: null,
    expirationDate: null,
    isConfirmed: false,
  },

  async registration(login: string, email: string, password: string): Promise<any> {
    const user = await this.usersService.createUser({login,email,password},emailConfirmation, passwordConfirmation)
    // -----

    if (!user) {
      return null
    }
    return await this.sendRegistraitonEmail(
      user.id,
      user.accountData.userName.email
    )
  },

  }
}
