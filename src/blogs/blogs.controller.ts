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
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: QueryPostInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.postsService.getPostsByBlogId(blogId, query);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return result;
  }

  @Post('/:blogId/posts')
  async createPostForBlog(
    @Body() postInput: BlogPostInputDto,
    @Param('blogId') blogId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newPostInput = { ...postInput, blogId };
    const result = await this.blogsService.createPostForBlog(blogId, postInput);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return result;
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() blogInput: BlogInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.blogsService.update(id, blogInput);
    console.log('76---put', result);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }

  @Delete('/:id')
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.blogsService.delete(id);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }
}
