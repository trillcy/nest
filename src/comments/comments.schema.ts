import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Status {
  @Prop()
  status: string | null;
  @Prop()
  userId: string | null;
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
export class CommentatorInfo {
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
}
@Schema()
export class Comment {
  @Prop()
  postId: string;
  @Prop()
  content: string;
  @Prop()
  commentatorInfo: CommentatorInfo;
  @Prop()
  createdAt: Date;
  @Prop()
  likesInfo: Extended;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
