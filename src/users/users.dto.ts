import { Length, IsString, IsEmail } from 'class-validator';

export class UserInputDto {
  @IsString()
  @Length(3, 10)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsEmail()
  email: string;
}

export class QueryUserInputDto {
  sortBy: string | null;
  sortDirection: string | null;
  pageNumber: string | null;
  pageSize: string | null;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class PaginatorUserViewDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewDto[];
}
