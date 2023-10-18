import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostSchema } from './posts.schema';
import {
  PostInputDto,
  QueryPostInputDto,
  PostViewDto,
  PaginatorPostViewDto,
} from './posts.dto';
import {
  PaginatorCommentViewDto,
  QueryCommentInputDto,
} from 'src/comments/comments.dto';
import { CommentsService } from 'src/comments/comments.service';
import { Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  getAll(@Query() query: QueryPostInputDto): Promise<PaginatorPostViewDto> {
    return this.postsService.getAll(query);
  }

  @Get('/:id')
  async getById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!id) return res.sendStatus(HttpStatus.NOT_FOUND); //404

    const result = await this.postsService.getById(id);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return result;
  }

  @Get('/:postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: QueryCommentInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.commentsService.getCommentsByPostId(
      postId,
      query,
    );
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return result;
  }

  @Post()
  async create(@Body() postInput: PostInputDto): Promise<PostViewDto | null> {
    const result = await this.postsService.createPost(postInput);
    console.log('41--post', result);
    return result;
  }
  // @Post('/:blogId/posts')
  // createPostForBlog(@Body() blogInput: BlogPostInputDto): Promise<PostSchema> {
  //   return this.postsService.create(blogInput);
  // }
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() blogInput: PostInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.postsService.updatePost(id, blogInput);
    if (!result) res.sendStatus(HttpStatus.NOT_FOUND); //404
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // возвращает удаленный объект
    // или null если не найдет его
    const result = await this.postsService.remove(id);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }
}
