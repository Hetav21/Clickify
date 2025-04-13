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
    chartData?: chartDataType[];
    tableData?: tableDataType[];
    analytics?: analyticsType;
    links?: linksDataType[];
  };
}

export type linksDataType = {
  id: string;
  os?: string | null;
  device?: string | null;
  browser?: string | null;
  timestamp?: Date | null;
  ip?: string | null;
  locale?: string | null;
  country?: string | null;
  referrer?: string | null;
};

export type analyticsType = {
  totalClicks?: number;
  totalMobileClicks?: number;
  totalDesktopClicks?: number;
  activeLinksCount?: number;
};

export type chartDataType = {
  date: string;
  mobile: number;
  desktop: number;
  other: number;
};

export type tableDataType = {
  id: string;
  longUrl: string;
  shortUrl: string;
  totalClicks: number;
  createdAt: Date;
  expiresAt: Date | null;
  isExpired: boolean;
};
