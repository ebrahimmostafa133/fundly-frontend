export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone: string;
  is_active: boolean;
  is_email_verified?: boolean;
  created_at: string;
  profile_picture?: string | null;
  date_of_birth?: string | null;
  country?: string;
  bio?: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ApiError {
  message: string;
  detail?: string;
  [key: string]: unknown;
}