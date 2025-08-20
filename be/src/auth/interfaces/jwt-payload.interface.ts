export interface JwtPayload {
  sub: number;
  username?: string;
  role?: string;
  iat?: number; // Thời điểm token được cấp (auto thêm)
  exp?: number; // Thời điểm token hết hạn (auto thêm)
}
