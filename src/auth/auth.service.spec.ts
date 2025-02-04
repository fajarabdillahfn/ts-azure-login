import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    findOrCreateByAzureId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAzureToken', () => {
    const mockValidToken = 'valid.azure.token';
    const mockDecodedToken = {
      oid: 'test-azure-id',
      email: 'test@example.com',
      name: 'Test User',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully validate a valid Azure token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      (jwt.decode as jest.Mock).mockReturnValue(mockDecodedToken);
      mockUsersService.findOrCreateByAzureId.mockResolvedValue(mockUser);

      const result = await service.validateAzureToken(mockValidToken);

      expect(mockUsersService.findOrCreateByAzureId).toHaveBeenCalledWith({
        azureId: mockDecodedToken.oid,
        email: mockDecodedToken.email,
        name: mockDecodedToken.name,
        metadata: {
          lastLogin: expect.any(Date),
          azureToken: mockDecodedToken,
        },
      });
      expect(jwt.decode).toHaveBeenCalledWith(mockValidToken);
      expect(result).toBeDefined();
      expect(result.user).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      (jwt.decode as jest.Mock).mockReturnValue(null);

      await expect(service.validateAzureToken('invalid.token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
