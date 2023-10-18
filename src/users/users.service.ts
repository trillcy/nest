import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  QueryUserInputDto,
  PaginatorUserViewDto,
  UserInputDto,
  UserViewDto,
} from './users.dto';
import { User, UserDocument } from './users.schema';
import bcrypt from 'bcrypt';
const usersFields = ['login', 'email', 'createdAt'];

const usersDirections = ['asc', 'desc'];

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(query: QueryUserInputDto): Promise<PaginatorUserViewDto> {
    const searchLogin = query.searchLoginTerm ? query.searchLoginTerm : '';
    const searchEmail = query.searchEmailTerm ? query.searchEmailTerm : '';
    // -----
    const sortField =
      query.sortBy && usersFields.includes(query.sortBy)
        ? query.sortBy
        : 'createdAt';
    const sortString =
      query.sortDirection && usersDirections.includes(query.sortDirection)
        ? query.sortDirection
        : 'desc';
    const sortValue = sortString === 'desc' ? -1 : 1;
    const sortObject: any = {};
    sortObject[sortField] = sortValue;
    const numberOfPage =
      query.pageNumber && Number.isInteger(+query.pageNumber)
        ? +query.pageNumber
        : 1;
    const size =
      query.pageSize && Number.isInteger(+query.pageSize)
        ? +query.pageSize
        : 10;
    const skipElements = (numberOfPage - 1) * size;

    const items = await this.userModel
      .find({
        $or: [
          {
            'accountData.userName.login': {
              $regex: searchLogin,
              $options: 'i',
            },
          },
          {
            'accountData.userName.email': {
              $regex: searchEmail,
              $options: 'i',
            },
          },
        ],
      })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .lean();

    const totalCount = await this.userModel.countDocuments({
      $or: [
        {
          'accountData.userName.login': { $regex: searchLogin, $options: 'i' },
        },
        {
          'accountData.userName.email': { $regex: searchEmail, $options: 'i' },
        },
      ],
    });
    const pagesCount = Math.ceil(totalCount / size);
    return {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: items.map((i) => ({
        id: i._id.toString(),
        login: i.accountData.userName.login,
        email: i.accountData.userName.email,
        createdAt: i.accountData.createdAt,
      })),
    };
  }

  async createUser(userDto: UserInputDto): Promise<UserViewDto | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userDto.password, passwordSalt);
    const date = new Date();
    const newElement = {
      accountData: {
        userName: { login: userDto.login, email: userDto.email },
        passwordHash,
        passwordSalt,
        createdAt: date.toISOString(),
      },
      // emailConfirmation: {
      //   confirmationCode: null,
      //   expirationDate: null,
      //   isConfirmed: false,
      // },
      // passwordConfirmation: {
      //   confirmationCode: null,
      //   expirationDate: null,
      //   isConfirmed: false,
      // },
      // deletedTokens: [],
    };

    const user = new this.userModel({ ...newElement });
    const result = await user.save();
    if (!result) return null;
    return {
      id: result.id,
      login: result.accountData.userName.login,
      email: result.accountData.userName.email,
      createdAt: result.accountData.createdAt,
    };
  }
  /*
  async updatePost(id: string, postDto: PostInputDto): Promise<any> {
    const result = await this.userModel.findByIdAndUpdate(id, postDto, {
      new: false,
    }); //новый не создается если не найден;
    console.log('187==posts.put', result);
    return result;
  }
*/
  async remove(id: string): Promise<any> {
    const result = await this.userModel.findByIdAndRemove(id);
    console.log('137==users', result);

    return result;
  }
  async deleteAll(): Promise<boolean> {
    const result = await this.userModel.deleteMany();
    return result.acknowledged ? true : false;
  }
}
