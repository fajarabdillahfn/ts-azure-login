import { LoggerService } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private getFormattedDate(): string {
    return new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok', // This is GMT+7
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(`[${this.getFormattedDate()}] [LOG] ${message}`, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(`[${this.getFormattedDate()}] [ERROR] ${message}`, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(`[${this.getFormattedDate()}] [WARN] ${message}`, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(`[${this.getFormattedDate()}] [DEBUG] ${message}`, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(`[${this.getFormattedDate()}] [VERBOSE] ${message}`, ...optionalParams);
  }
}