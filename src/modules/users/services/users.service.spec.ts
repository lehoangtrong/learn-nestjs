import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => Promise.resolve({ ...user, id: 1 })),
    find: jest.fn().mockImplementation(() => Promise.resolve([mockUser])),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === 1) return Promise.resolve(mockUser);
      return Promise.resolve(null);
    }),
    findByEmail: jest.fn().mockImplementation(email => {
      if (email === 'test@example.com') return Promise.resolve(mockUser);
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
      };

      const result = await service.create(createUserDto);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if user not found', async () => {
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if user not found', async () => {
      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });
}); 