export class PostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class PostDBDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoDB;
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
export class QueryPostInputDto {
  pageNumber: string | null;
  pageSize: string | null;
  sortBy: string | null;
  sortDirection: string | null;
  blogId: string | null;
}

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: LikeDetailsView[];
  };
}

export class PaginatorPostViewDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewDto[];
}
