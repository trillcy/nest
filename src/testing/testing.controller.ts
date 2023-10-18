import { Controller, Delete, HttpStatus, Res } from '@nestjs/common';
import { BlogsService } from 'src/blogs/blogs.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { CommentsService } from 'src/comments/comments.service';
import { Response } from 'express';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
  ) {}

  @Delete('/all-data')
  async deleteAll(@Res({ passthrough: true }) res: Response) {
    const deleteBlogs = await this.blogsService.deleteAll();
    const deletePosts = await this.postsService.deleteAll();
    const deleteUsers = await this.usersService.deleteAll();
    const deleteComments = await this.commentsService.deleteAll();
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }
}
