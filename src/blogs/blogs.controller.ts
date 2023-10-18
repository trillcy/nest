import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  BlogInputDto,
  BlogPostInputDto,
  BlogQueryInputDto,
  BlogViewDto,
  PaginatorBlogViewDto,
} from 'src/blogs/blogs.dto';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.schema';
import { PostViewDto } from 'src/posts/posts.dto';
import { PostsService } from 'src/posts/posts.service';
import { QueryPostInputDto, PaginatorPostViewDto } from 'src/posts/posts.dto';
import { Response } from 'express';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async getAll(
    @Query() query: BlogQueryInputDto,
  ): Promise<PaginatorBlogViewDto> {
    const result = await this.blogsService.getAll(query);
    return result;
  }

  @Get('/:id')
  async getById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.blogsService.getById(id);
    console.log('48----', result);

    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND);
    return result;
  }

  @Post()
  async create(@Body() blogInput: BlogInputDto): Promise<BlogViewDto> {
    return await this.blogsService.create(blogInput);
  }

  @Get('/:blogId/posts')
  getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: QueryPostInputDto,
  ): Promise<PaginatorPostViewDto> {
    return this.postsService.getPostsByBlogId(blogId, query);
  }

  @Post('/:blogId/posts')
  async createPostForBlog(
    @Body() postInput: BlogPostInputDto,
    @Param('blogId') blogId: string,
  ): Promise<PostViewDto | null> {
    const newPostInput = { ...postInput, blogId };
    return await this.blogsService.createPostForBlog(blogId, postInput);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() blogInput: BlogInputDto,
  ): Promise<any> {
    const result = this.blogsService.update(id, blogInput);
    console.log('76---put', result);
    return result;
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<any> {
    // TODO: если возвращается null, то документ не найден - надо 404
    return this.blogsService.remove(id);
  }
  // @Delete()
  // removeAll(): Promise<boolean> {
  //   return this.blogsService.removeAll();
  // }
}
