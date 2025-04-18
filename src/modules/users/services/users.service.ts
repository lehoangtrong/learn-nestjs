/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [];

  create(createUserDto: CreateUserDto): IUser {
    const user: IUser = {
      id: this.users.length + 1,
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): IUser[] {
    return this.users;
  }

  findOne(id: number): IUser {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
} 