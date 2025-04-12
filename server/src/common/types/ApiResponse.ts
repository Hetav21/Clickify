// Standard API response format
export interface ApiResponse {
  success: boolean;
  message: string;
  info?: {
    id?: string;
    email?: string;
    token?: string;
    shortId?: string;
  };
}
