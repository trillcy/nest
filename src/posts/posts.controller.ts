import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
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
  getById(@Param('id') id: string): Promise<PostViewDto | null> {
    return this.postsService.getById(id);
  }

  @Get('/:postId/comments')
  getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: QueryCommentInputDto,
  ): Promise<PaginatorCommentViewDto> {
    return this.commentsService.getCommentsByPostId(postId, query);
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
  update(
    @Param('id') id: string,
    @Body() blogInput: PostInputDto,
  ): Promise<any> {
    return this.postsService.updatePost(id, blogInput);
  }
  @Delete(':id')
  remove(@Param('id') id: string): Promise<PostSchema> {
    // возвращает удаленный объект
    // или null если не найдет его
    return this.postsService.remove(id);
  }
}
