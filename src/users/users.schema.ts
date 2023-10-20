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

export const UserNameSchema = SchemaFactory.createForClass(UserName);

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

export const AccountDataSchema = SchemaFactory.createForClass(AccountData);

@Schema()
export class EmailConfirmation {
  @Prop()
  confirmationCode: string | null;
  @Prop()
  expirationDate: string | null;
  @Prop()
  isConfirmed: boolean;
}
export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class PasswordConfirmation {
  @Prop()
  confirmationCode: string | null;
  @Prop()
  expirationDate: string | null;
  @Prop()
  isConfirmed: boolean;
}

export const PasswordConfirmationSchema =
  SchemaFactory.createForClass(PasswordConfirmation);

@Schema()
export class User {
  @Prop()
  accountData: AccountData;
  @Prop()
  emailConfirmation: EmailConfirmation;
  @Prop()
  passwordConfirmation: PasswordConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);
