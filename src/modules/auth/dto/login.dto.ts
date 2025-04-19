import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email address of the user',
        format: 'email'
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @MaxLength(100, { message: 'Email must not exceed 100 characters' })
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password (minimum 6 characters)',
        minLength: 6,
        format: 'password'
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(100, { message: 'Password must not exceed 100 characters' })
    password: string;
}
