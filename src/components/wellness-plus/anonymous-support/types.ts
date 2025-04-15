
export interface AnonymousPost {
  id: string;
  message: string;
  date: Date;
  supportCount: number;
  tag: string;
  responses: PostResponse[];
}

export interface PostResponse {
  id: string;
  message: string;
  isStaff: boolean;
  date: Date;
}
