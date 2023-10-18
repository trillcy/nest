import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class UserName {
  @Prop()
  login: string;

  @Prop()
  email: string;
}

@Schema()
export class AccountData {
  @Prop()
  userName: UserName;

  @Prop()
  createdAt: string;

  @Prop()
  passwordHash: string;

  @Prop()
  passwordSalt: string;
}

@Schema()
export class User {
  @Prop()
  accountData: AccountData;
}

export const UserSchema = SchemaFactory.createForClass(User);
