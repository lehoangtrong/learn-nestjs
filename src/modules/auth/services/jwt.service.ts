import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(payload: Omit<JwtPayload, 'type'>): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, type: 'access' },
        { expiresIn: this.configService.get('jwt.expiresIn') }
      ),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        { expiresIn: this.configService.get('jwt.refreshExpiresIn') }
      )
    ]);

    return { 
      accessToken: `Bearer ${accessToken}`, 
      refreshToken: `Bearer ${refreshToken}` 
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    // Loại bỏ tiền tố "Bearer " nếu có
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
    return this.jwtService.verifyAsync(tokenValue);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = await this.verifyToken(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const accessToken = await this.jwtService.signAsync(
      { ...payload, type: 'access' },
      { expiresIn: this.configService.get('jwt.expiresIn') }
    );

    return { accessToken: `Bearer ${accessToken}` };
  }
} 