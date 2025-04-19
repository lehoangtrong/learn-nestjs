import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email address of the user',
        format: 'email'
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @MaxLength(100, { message: 'Email must not exceed 100 characters' })
    email: string;

    @ApiProperty({
        example: 'johndoe',
        description: 'Username (minimum 3 characters)',
        minLength: 3
    })
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(50, { message: 'Username must not exceed 50 characters' })
    @Matches(/^[a-zA-Z0-9_]+$/, { 
        message: 'Username can only contain letters, numbers, and underscores' 
    })
    username: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password (minimum 6 characters)',
        minLength: 6,
        format: 'password'
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(100, { message: 'Password must not exceed 100 characters' })
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    })
    password: string;

    @ApiProperty({
        example: UserRole.USER,
        description: 'User role',
        enum: UserRole,
        default: UserRole.USER,
        required: false
    })
    @IsEnum(UserRole, { message: 'Invalid role' })
    @IsOptional()
    role?: UserRole;
}
