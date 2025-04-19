import { UserRole } from '../modules/users/entities/user.entity';

/**
 * JwtPayload Interface
 * 
 * Định nghĩa cấu trúc dữ liệu được mã hóa trong JWT token.
 * Interface này xác định các thông tin được lưu trữ trong payload của token.
 * 
 * @property {number} sub - ID của người dùng (subject)
 * @property {string} email - Địa chỉ email của người dùng
 * @property {UserRole} role - Vai trò/quyền hạn của người dùng
 * @property {number} iat - Thời điểm token được tạo (issued at)
 * @property {number} exp - Thời điểm token hết hạn (expiration)
 * @property {string} type - Loại token (access hoặc refresh)
 */
export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
} 