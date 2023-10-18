import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Status {
  @Prop()
  addedAt: Date | null;
  @Prop()
  status: string | null;
  @Prop()
  userId: string | null;
  @Prop()
  login: string | null;
}

@Schema()
export class Extended {
  @Prop()
  likesCount: number;
  @Prop()
  dislikesCount: number;
  @Prop()
  statuses: Status;
}
@Schema()
export class Post {
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  createdAt: Date;
  @Prop()
  blogId: string;
  @Prop()
  blogName: string;
  @Prop()
  extendedLikesInfo: Extended;
}

export const PostSchema = SchemaFactory.createForClass(Post);
