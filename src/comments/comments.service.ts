import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatorCommentViewDto } from 'src/comments/comments.dto';
import { Comment, CommentDocument } from './comments.schema';
import { Model, Types } from 'mongoose';
import { CommentViewDto, QueryCommentInputDto } from './comments.dto';
import { PostsService } from 'src/posts/posts.service';
import { Post, PostDocument } from 'src/posts/posts.schema';

const commentsFields = [
  'content',
  'commentatorInfo.userId',
  'commentatorInfo.userLogin',
  'createdAt',
  'likesInfo.likesCount',
  'likesInfo.dislikesCount',
];

const commentsDirections = ['asc', 'desc'];

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async getCommentsByPostId(
    postId: string,
    query: QueryCommentInputDto,
  ): Promise<PaginatorCommentViewDto | null> {
    // -----
    if (!Types.ObjectId.isValid(postId)) return null;

    const post = await this.postModel.findById(postId);
    if (!post) return null;
    const sortField =
      query.sortBy && commentsFields.includes(query.sortBy)
        ? query.sortBy
        : 'createdAt';
    const sortString =
      query.sortDirection && commentsDirections.includes(query.sortDirection)
        ? query.sortDirection
        : 'desc';
    const sortValue = sortString === 'desc' ? -1 : 1;
    const sortObject: any = {};
    sortObject[sortField] = sortValue;
    // ------
    // TODO: проверить общее количество элементов в коллекции
    // если меньше, то поставить соответствующий skipElements
    // ------
    const numberOfPage =
      query.pageNumber && Number.isInteger(+query.pageNumber)
        ? +query.pageNumber
        : 1;
    const size =
      query.pageSize && Number.isInteger(+query.pageSize)
        ? +query.pageSize
        : 10;
    const skipElements = (numberOfPage - 1) * size;

    const items = await this.commentModel
      .find({ postId })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .lean();
    const totalCount = await this.commentModel.countDocuments({
      postId,
    });
    const pagesCount = Math.ceil(totalCount / size);
    const resultArray = [];

    const result = items.map((el) => {
      return {
        id: el._id.toString(),
        content: el.content,
        commentatorInfo: {
          userId: el.commentatorInfo.userId,
          userLogin: el.commentatorInfo.userLogin,
        },
        createdAt: el.createdAt.toISOString(),
        likesInfo: {
          likesCount: el.likesInfo.likesCount,
          dislikesCount: el.likesInfo.dislikesCount,
          myStatus: 'None',
        },
      };
    });
    return {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: result,
    };
  }

  async getById(id: string): Promise<CommentViewDto | null> {
    const result = await this.commentModel.findById(id);

    if (!result) return null;
    return {
      id: result._id.toString(),
      content: result.content,
      commentatorInfo: {
        userId: result.commentatorInfo.userId,
        userLogin: result.commentatorInfo.userLogin,
      },
      createdAt: result.createdAt.toISOString(),
      likesInfo: {
        likesCount: result.likesInfo.likesCount,
        dislikesCount: result.likesInfo.dislikesCount,
        myStatus: 'None',
      },
    };
  }
  async deleteAll(): Promise<boolean> {
    const result = await this.commentModel.deleteMany();
    return result.acknowledged ? true : false;
  }
}
