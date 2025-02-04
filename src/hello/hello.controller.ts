import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Logger } from '@nestjs/common';

@Controller('api/hello')
export class HelloController {
  private readonly logger = new Logger(HelloController.name);

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Request() req: any) {
    this.logger.debug('getHello method called');
    return {
      message: 'Hello World!',
      user: req.user, // This will contain the decoded JWT payload
    };
  }
}
