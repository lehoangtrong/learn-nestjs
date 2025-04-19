import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * 
 * Bảo vệ các route yêu cầu xác thực JWT
 * Sử dụng chiến lược 'jwt' từ Passport
 * Kế thừa từ AuthGuard của @nestjs/passport
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}