
export interface AnonymousResponse {
  id: string;
  message: string;
  isStaff: boolean;
  date: Date;
}

export interface AnonymousPost {
  id: string;
  message: string;
  date: Date;
  supportCount: number;
  responses: AnonymousResponse[];
  tag: string;
}
