export class BlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class BlogQueryInputDto {
  searchNameTerm: string | null;
  pageNumber: number | null;
  pageSize: number | null;
  sortBy: string | null;
  sortDirection: string | null;
}

export class BlogPostInputDto {
  title: string;
  shortDescription: string;
  content: string;
}

export class BlogViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export class PaginatorBlogViewDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewDto[];
}
