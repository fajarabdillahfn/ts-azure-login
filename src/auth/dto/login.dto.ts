import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Azure AD access token',
    example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for subsequent API calls',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john.doe@example.com',
      role: 'user',
    },
  })
  user: {
    id: string;
    email: string;
    role: string;
  };
}
