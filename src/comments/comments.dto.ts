export class QueryCommentInputDto {
  pageNumber: string | null;
  pageSize: string | null;
  sortBy: string | null;
  sortDirection: string | null;
  blogId: string | null;
}
export class LikeDetailsView {
  description: string | 'None';
  addedAt: string | null;
  userId: string | null;
  login: string | null;
}

export class ExtendedLikesInfoDB {
  likesCount: number;
  dislikesCount: number;
  statuses: LikeDetailsView[];
}
export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
}

export class PaginatorCommentViewDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewDto[];
}
