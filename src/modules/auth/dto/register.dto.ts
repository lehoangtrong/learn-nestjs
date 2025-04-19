import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email address of the user',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        example: 'username123',
        description: 'Username of the user',
    })
    @IsString({ message: 'Username must be a string' })
    @IsNotEmpty({ message: 'Username is required' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers and underscores',
    })
    username: string;

    @ApiProperty({
        example: 'password123',
        description: 'Password of the user',
    })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
    })
    password: string;

    @ApiProperty({
        example: 'user',
        description: 'Role of the user',
        enum: UserRole,
        default: UserRole.USER,
    })
    @IsEnum(UserRole, { message: 'Invalid role' })
    @IsNotEmpty({ message: 'Role is required' })
    role: UserRole;
}
