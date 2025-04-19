import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtAuthService } from './jwt.service';
import { PasswordService } from './password.service';
import { UserRole } from '../../users/entities/user.entity';
import { UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtAuthService: JwtAuthService;
  let passwordService: PasswordService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    role: UserRole.USER,
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtAuthService = {
    generateTokens: jest.fn().mockResolvedValue({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    }),
    refreshToken: jest.fn().mockResolvedValue({
      accessToken: 'newAccessToken',
    }),
  };

  const mockPasswordService = {
    hash: jest.fn().mockResolvedValue('hashedpassword'),
    compare: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtAuthService,
          useValue: mockJwtAuthService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtAuthService = module.get<JwtAuthService>(JwtAuthService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
      role: UserRole.USER,
    };

    it('should register a new user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(passwordService.hash).toHaveBeenCalledWith(registerDto.password);
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should allow admin to create admin account', async () => {
      const adminRegisterDto = { ...registerDto, role: UserRole.ADMIN };
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ ...mockUser, role: UserRole.ADMIN });

      const result = await service.register(adminRegisterDto, { role: UserRole.ADMIN });
      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('should throw ForbiddenException if non-admin tries to create admin account', async () => {
      const adminRegisterDto = { ...registerDto, role: UserRole.ADMIN };

      await expect(service.register(adminRegisterDto, { role: UserRole.USER }))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(jwtAuthService.generateTokens).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token successfully', async () => {
      const result = await service.refreshToken('validRefreshToken');
      expect(result).toHaveProperty('access_token');
      expect(jwtAuthService.refreshToken).toHaveBeenCalledWith('validRefreshToken');
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtAuthService.refreshToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refreshToken('invalidToken')).rejects.toThrow(UnauthorizedException);
    });
  });
}); 