import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BlogInputDto,
  BlogPostInputDto,
  BlogQueryInputDto,
  BlogViewDto,
  PaginatorBlogViewDto,
} from 'src/blogs/blogs.dto';
import { Blog, BlogDocument } from './blogs.schema';
import { Model, Types } from 'mongoose';
import { PostInputDto, PostViewDto } from 'src/posts/posts.dto';
import { Post, PostDocument } from 'src/posts/posts.schema';
import { PostsService } from 'src/posts/posts.service';

const blogsFields = [
  'id',
  'name',
  'description',
  'websiteUrl',
  'createdAt',
  'isMembership',
];

const blogsDirections = ['asc', 'desc'];

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    private readonly postsService: PostsService,
  ) {}

  async getAll(query: BlogQueryInputDto): Promise<PaginatorBlogViewDto> {
    const searchName = query.searchNameTerm ? query.searchNameTerm : '';
    // -----
    const sortField =
      query.sortBy && blogsFields.includes(query.sortBy)
        ? query.sortBy
        : 'createdAt';
    const sortString =
      query.sortDirection && blogsDirections.includes(query.sortDirection)
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

    const items = await this.blogModel
      .find({ name: { $regex: searchName, $options: 'i' } })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .lean();
    const totalCount = await this.blogModel.countDocuments({
      name: { $regex: searchName, $options: 'i' },
    });
    const pagesCount = Math.ceil(totalCount / size);
    const resultArray = [];

    const result = items.map((el) => {
      return {
        id: el._id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl,
        createdAt: el.createdAt,
        isMembership: el.isMembership,
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

  async getById(id: string): Promise<BlogViewDto | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const result = await this.blogModel.findById(id);
    console.log('88===', result);

    if (!result) return null;
    return {
      id: result._id.toString(),
      name: result.name,
      description: result.description,
      websiteUrl: result.websiteUrl,
      createdAt: result.createdAt,
      isMembership: result.isMembership,
    };
  }

  async createPostForBlog(
    blogId: string,
    postInput: BlogPostInputDto,
  ): Promise<PostViewDto | null> {
    if (!Types.ObjectId.isValid(blogId)) return null;

    const blog = await this.blogModel.findById(blogId);
    if (!blog) return null;

    const newPostInput = { ...postInput, blogId };
    const result = await this.postsService.createPost(newPostInput);
    return result;
  }

  async create(blogDto: BlogInputDto): Promise<BlogViewDto> {
    const newBlog = new this.blogModel({
      ...blogDto,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });
    const result = await newBlog.save();
    return {
      id: result._id.toString(),
      name: result.name,
      description: result.description,
      websiteUrl: result.websiteUrl,
      createdAt: result.createdAt,
      isMembership: result.isMembership,
    };
  }

  async update(id: string, blogDto: BlogInputDto): Promise<any> {
    if (!Types.ObjectId.isValid(id)) return null;
    const result = await this.blogModel.findByIdAndUpdate(id, blogDto, {
      new: false, //если не найден, то новый не создается
    });
    console.log('145==blog', result);

    return result;
  }

  async delete(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) return null;

    const result = await this.blogModel.findByIdAndDelete(id);
    // ???возвращает удаленный объект || null если не найдет
    return result;
  }

  async deleteAll(): Promise<boolean> {
    const result = await this.blogModel.deleteMany();
    return result.acknowledged ? true : false;
  }
}
