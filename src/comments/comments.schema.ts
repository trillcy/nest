import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Status {
  @Prop({ type: String, default: null })
  status: string | null;
  @Prop({ type: String, default: null })
  userId: string | null;
}

const StatusSchema = SchemaFactory.createForClass(Status);

@Schema()
export class Extended {
  @Prop()
  likesCount: number;
  @Prop()
  dislikesCount: number;
  @Prop({ type: [StatusSchema], default: [] })
  statuses: Status[] | [];
}
const ExtendedSchema = SchemaFactory.createForClass(Extended);

@Schema()
export class CommentatorInfo {
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
}

const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema()
export class Comment {
  @Prop()
  postId: string;
  @Prop()
  content: string;
  @Prop({ type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfo;
  @Prop()
  createdAt: Date;
  @Prop({ type: ExtendedSchema })
  likesInfo: Extended;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
