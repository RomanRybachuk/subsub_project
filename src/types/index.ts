export interface IComment {
  id: string;
  name: string;
  text: string;
  avatar: string;
  created_at_timestamp: number;
  likes: number;
  liked?: boolean;
  parent?: string;
  replying?: boolean;
  replies: IComment[];
}
