import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, decode } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { Logger } from '@nestjs/common';
import { LoginResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateAzureToken(azureToken: string): Promise<LoginResponseDto>  {
    try {
      this.logger.debug('Validating Azure AD token');
      
      // Verify and decode the Azure AD token
      const decodedToken = decode(azureToken);
      
      if (!decodedToken) {
        this.logger.error('Invalid token: Token could not be decoded');
        throw new UnauthorizedException('Invalid token');
      }

      // Store or update user in database
      const email = decodedToken['email'] || decodedToken['preferred_username'];
      const name = decodedToken['name'];

      if (!email) {
        this.logger.error('Invalid token: No email found in token');
        throw new UnauthorizedException('Invalid token: No email found');
      }

      this.logger.log(`Processing login for user: ${email}`);

      const user = await this.usersService.findByEmail(email);
      if (user.name !== name) {
        await this.usersService.update(user.userId, {
          name,
        });
      }

      this.logger.debug(`User ${email} processed successfully`);

      // Create a JWT token with user information
      const payload = {
        sub: user.userId,
        email: user.email,
        role: user.roles[0].role.roleName,
      };

      const jwt = this.jwtService.sign(payload);
      this.logger.debug('JWT token generated successfully');

      return {
        accessToken: jwt,
        user: {
          id: user.userId,
          email: user.email,
          role: user.roles[0].role.roleName,
        },
      };
    } catch (error) {
      this.logger.error('Authentication failed', error.stack);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
