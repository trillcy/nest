import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts/posts.controller';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { PostsService } from './posts/posts.service';
import { Blog, BlogSchema } from './blogs/blogs.schema';
import { Post, PostSchema } from './posts/posts.schema';
import { User, UserSchema } from './users/users.schema';
import { UsersService } from './users/users.service';
import { Comment, CommentSchema } from './comments/comments.schema';
import { TestingController } from './testing/testing.controller';

const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Comment.name, schema: CommentSchema },
];

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://aermakov72:MObdb4xJff0p1YPC@cluster0.byjv9wm.mongodb.net/incubator?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature(mongooseModels),
  ],
  controllers: [
    AppController,
    UsersController,
    PostsController,
    BlogsController,
    TestingController,
  ],
  providers: [AppService, BlogsService, PostsService, UsersService],
})
export class AppModule {}
