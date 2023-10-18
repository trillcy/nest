import { Controller, Delete } from '@nestjs/common';
import { BlogsService } from 'src/blogs/blogs.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { CommentsService } from 'src/comments/comments.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
  ) {}

  @Delete('/all-data')
  async deleteAll(): Promise<boolean> {
    await this.blogsService.deleteAll();
    await this.postsService.deleteAll();
    await this.usersService.deleteAll();
    await this.commentsService.deleteAll();
    return true;
  }
}
