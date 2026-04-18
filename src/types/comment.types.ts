export interface CommentUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string | null;
}

export interface Comment {
  id: number;
  user: CommentUser;
  content: string;
  created_at: string;
  replies: Comment[];
}
