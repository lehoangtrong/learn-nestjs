import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../interfaces/jwt-payload.interface';

/**
 * JWT Strategy
 * 
 * Chiến lược xác thực JWT sử dụng Passport
 * Trích xuất token từ Authorization header
 * Xác thực token và trả về thông tin người dùng
 * 
 * Cách sử dụng:
 * 1. Thêm @UseGuards(JwtAuthGuard) vào controller hoặc route
 * 2. Truy cập thông tin người dùng qua @Request() req
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * Xác thực JWT payload và trả về thông tin người dùng
   * @param payload Dữ liệu từ JWT token đã được giải mã
   * @returns Thông tin người dùng sẽ được gắn vào request
   */
  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
} 