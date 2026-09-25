export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN";
}
export interface LoginResult {
  accessToken: string;
  expiresIn: number;
  user: AdminUser;
}
