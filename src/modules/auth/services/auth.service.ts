import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserRole } from '../../users/entities/user.entity';
import { PasswordService } from './password.service';
import { JwtPayload } from '../../../interfaces/jwt-payload.interface';
import { JwtAuthService } from './jwt.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private passwordService: PasswordService,
        private jwtAuthService: JwtAuthService,
    ) {}

    async register(registerDto: RegisterDto, currentUser?: { role: UserRole }) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        if (registerDto.role === UserRole.ADMIN) {
            if (!currentUser || currentUser.role !== UserRole.ADMIN) {
                throw new ForbiddenException('Only admin can create admin accounts');
            }
        }

        const hashedPassword = await this.passwordService.hash(registerDto.password);
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
            role: registerDto.role || UserRole.USER,
        });

        const { password, ...result } = user; // Loại bỏ password khỏi kết quả trả về
        return result;
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.passwordService.compare(
            loginDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: Omit<JwtPayload, 'type'> = { 
            sub: user.id, 
            email: user.email,
            role: user.role,
        };

        const tokens = await this.jwtAuthService.generateTokens(payload);
        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const { accessToken } = await this.jwtAuthService.refreshToken(refreshToken);
            return {
                access_token: accessToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
