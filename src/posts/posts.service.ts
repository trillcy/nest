import { Injectable } from '@nestjs/common';
import { Post, PostDocument } from './posts.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostDBDto,
  QueryPostInputDto,
  PostInputDto,
  ExtendedLikesInfoDB,
  LikeDetailsView,
  PostViewDto,
  PaginatorPostViewDto,
} from './posts.dto';
import { Blog, BlogDocument } from 'src/blogs/blogs.schema';

const postsFields = [
  'id',
  'title',
  'shortDescription',
  'content',
  'blogId',
  'blogName',
  'likesCount',
  'dislikesCount',
  // 'extendedLikesInfo.likesCount',
  // 'extendedLikesInfo.dislikesCount',
];

const postsDirections = ['asc', 'desc'];

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async getPostsByBlogId(
    blogId: string,
    query: QueryPostInputDto,
  ): Promise<PaginatorPostViewDto | null> {
    if (!Types.ObjectId.isValid(blogId)) return null;
    const blog = await this.blogModel.findById(blogId);
    console.log('43===post', blog);

    if (!blog) return null;
    // ------
    let sortField =
      query.sortBy && postsFields.includes(query.sortBy)
        ? query.sortBy
        : 'createdAt';
    if (sortField === 'likesCount' || sortField === 'dislikesCount')
      sortField = `extendedLikesInfo.${sortField}`;
    const sortString =
      query.sortDirection && postsDirections.includes(query.sortDirection)
        ? query.sortDirection
        : 'desc';
    const sortValue = sortString === 'desc' ? -1 : 1;
    const sortObject: any = {};
    sortObject[sortField] = sortValue;
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
    // -----

    // ---------
    // return await this.postModel.find().exec();

    const items = await this.postModel
      .find({ blogId }) //, { projection: { _id: 0 } })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .lean();
    console.log('78===post', items);

    const totalCount = await this.postModel.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / size);

    const array: PostViewDto[] = items.map((el): PostViewDto => {
      return {
        id: el._id.toString(),
        title: el.title,
        shortDescription: el.shortDescription,
        content: el.content,
        blogId: el.blogId,
        blogName: el.blogName,
        createdAt: el.createdAt.toISOString(),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
          // likesCount: el.extendedLikesInfo.likesCount,
          // dislikesCount: el.extendedLikesInfo.dislikesCount,
          // myStatus: userStatus,
          // newestLikes: newestLikes,
        },
      };
    });
    const result: PaginatorPostViewDto = {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: array,
    };
    return result;

    // -----
    // ------
  }

  async getAll(query: QueryPostInputDto): Promise<PaginatorPostViewDto> {
    let sortField =
      query.sortBy && postsFields.includes(query.sortBy)
        ? query.sortBy
        : 'createdAt';
    if (sortField === 'likesCount' || sortField === 'dislikesCount')
      sortField = `extendedLikesInfo.${sortField}`;
    const sortString =
      query.sortDirection && postsDirections.includes(query.sortDirection)
        ? query.sortDirection
        : 'desc';
    const sortValue = sortString === 'desc' ? -1 : 1;
    const sortObject: any = {};
    sortObject[sortField] = sortValue;
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
    // -----

    const searchObject = query.blogId ? { blogId: query.blogId } : {};
    // ---------
    // return await this.postModel.find().exec();

    const items = await this.postModel
      .find(searchObject) //, { projection: { _id: 0 } })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .lean();
    console.log('113++repo-items', items);

    const totalCount = await this.postModel.countDocuments(searchObject);
    const pagesCount = Math.ceil(totalCount / size);

    const array: PostViewDto[] = items.map((el): PostViewDto => {
      /*
      // определяем статус для конкретного поста
      let userStatus = 'None';

      if (likeDetails.userId) {
        const hasUserStatus = el.extendedLikesInfo.statuses.filter(
          (el) => el.userId === likeDetails.userId,
        );
        userStatus = hasUserStatus.length
          ? hasUserStatus[0].description
          : 'None';
      }

      // находим первые три элемента по дате
      const filteredLikes = el.extendedLikesInfo.statuses.filter(
        (el) => el.description === 'Like',
      );
      const sortedLikes = filteredLikes.sort(
        (a, b) => b.addedAt.getTime() - a.addedAt.getTime(),
      );
      const newestLikes = sortedLikes.slice(0, 3).map((el) => {
        return {
          addedAt: el.addedAt.toISOString(),
          userId: el.userId,
          login: el.login,
        };
      });
*/
      console.log('108===posts.getAll', el.id);

      return {
        id: el._id.toString(),
        title: el.title,
        shortDescription: el.shortDescription,
        content: el.content,
        blogId: el.blogId,
        blogName: el.blogName,
        createdAt: el.createdAt.toISOString(),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
          // likesCount: el.extendedLikesInfo.likesCount,
          // dislikesCount: el.extendedLikesInfo.dislikesCount,
          // myStatus: userStatus,
          // newestLikes: newestLikes,
        },
      };
    });
    const result: PaginatorPostViewDto = {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: array,
    };
    return result;

    // -----
    // ------
  }

  async getById(id: string): Promise<PostViewDto | null> {
    return await this.postModel.findById(id);
  }

  async createPost(postDto: PostInputDto): Promise<PostViewDto | null> {
    const blog = await this.blogModel.findById(postDto.blogId);
    // В swagger нет данных если блог не найден
    if (!blog) return null;
    const createdAt = new Date();
    const extendedLikesInfo: ExtendedLikesInfoDB = {
      likesCount: 0,
      dislikesCount: 0,
      statuses: [],
    };
    const newBlog = new this.postModel({
      ...postDto,
      blogName: blog.name,
      createdAt: createdAt.toISOString(),
      extendedLikesInfo,
    });
    const result = await newBlog.save();
    console.log('166--post.post', result);

    return {
      id: result._id.toString(),
      title: result.title,
      shortDescription: result.shortDescription,
      content: result.content,
      createdAt: result.createdAt.toISOString(),
      blogId: result.blogId,
      blogName: result.blogName,
      extendedLikesInfo: {
        likesCount: result.extendedLikesInfo.likesCount,
        dislikesCount: result.extendedLikesInfo.dislikesCount,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async updatePost(id: string, postDto: PostInputDto): Promise<any> {
    if (!Types.ObjectId.isValid(id)) return null;

    const result = await this.postModel.findByIdAndUpdate(id, postDto, {
      new: false,
    }); //новый не создается если не найден;
    console.log('187==posts.put', result);
    return result;
  }

  async remove(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) return null;

    const result = await this.postModel.findByIdAndRemove(id);
    console.log('190==', result);

    return result;
  }
  async deleteAll(): Promise<boolean> {
    const result = await this.postModel.deleteMany();
    return result.acknowledged ? true : false;
  }
}
