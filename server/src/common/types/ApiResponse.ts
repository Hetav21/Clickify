// Standard API response format
export interface ApiResponse {
  success: boolean;
  message: string;
  info?: {
    id?: string;
    email?: string;
    token?: string;
    shortUrl?: string;
    longUrl?: string;
    chartData?: {
      date: string;
      mobile: number;
      desktop: number;
      other: number;
    }[];
  };
}
