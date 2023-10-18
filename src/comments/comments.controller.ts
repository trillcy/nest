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
import { CommentsService } from './comments.service';
import { Response } from 'express';
import { CommentViewDto, QueryCommentInputDto } from './comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/:id')
  async getById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!id) return res.sendStatus(HttpStatus.NOT_FOUND); //404

    const result = await this.commentsService.getById(id);
    console.log('39--comment.getByPostId--', result);

    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND);
    return result;
  }
  /*
  @Post()
  async create(@Body() blogInput: BlogInputDto): Promise<BlogViewDto> {
    return await this.commentsService.create(blogInput);
  }

  // @Post('/:blogId/posts')
  // async createPostForBlog(
  //   @Body() postInput: BlogPostInputDto,
  //   @Param('blogId') blogId: string,
  // ): Promise<PostViewDto | null> {
  //   console.log('46--blog');

  //   const newPostInput = { ...postInput, blogId };
  //   return await this.postsService.create(newPostInput);
  // }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() blogInput: BlogInputDto,
  ): Promise<any> {
    const result = this.commentsService.update(id, blogInput);
    console.log('76---put', result);
    return result;
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<any> {
    // TODO: если возвращается null, то документ не найден - надо 404
    return this.commentsService.remove(id);
  }
  // @Delete()
  // removeAll(): Promise<boolean> {
  //   return this.blogsService.removeAll();
  // }
  */
}
