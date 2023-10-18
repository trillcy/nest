import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Mongoose } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Status {
  @Prop({ type: Date, default: null })
  addedAt: Date | null;
  @Prop({ type: String, default: null })
  status: string | null;
  @Prop({ type: String, default: null })
  userId: string | null;
  @Prop({ type: String, default: null })
  login: string | null;
}

const StatusSchema = SchemaFactory.createForClass(Status);

@Schema({ _id: false })
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
  @Prop({ type: ExtendedSchema })
  extendedLikesInfo: Extended;
}

export const PostSchema = SchemaFactory.createForClass(Post);
