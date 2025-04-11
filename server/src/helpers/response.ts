import type { Response } from "express";
import type { ApiResponse } from "../common/types/ApiResponse";

interface RateLimitInfo {
  limit?: number;
  usageLeft?: number;
}

// Standard response helper function
export function response(
  data: ApiResponse,
  code: number,
  res: Response,
  rateLimitInfo?: RateLimitInfo,
  headers?: Record<string, string>,
) {
  const { limit, usageLeft } = rateLimitInfo || {};

  return res
    .set({
      ...(limit !== undefined && { "X-RateLimit-Limit": limit.toString() }),
      ...(usageLeft !== undefined && {
        "X-RateLimit-Remaining": usageLeft.toString(),
      }),
      ...headers,
    })
    .status(code)
    .json(data);
}
