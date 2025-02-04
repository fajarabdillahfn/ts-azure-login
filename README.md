# NestJS Azure SSO Example Project

This is a sample project built with NestJS framework.

## Prerequisites

- Docker and Docker Compose
- Make
- pnpm (for local development)

## Installation

```bash
# Install dependencies
$ make install
```

## Development

```bash
# Start development environment (builds, starts services, and shows logs)
$ make dev

# Start all services in background
$ make up

# Stop all services
$ make down

# Rebuild services
$ make rebuild

# View logs
$ make logs

# View app-specific logs
$ make app-logs

# View database logs
$ make db-logs
```

## Database Operations

```bash
# Run migrations
$ make migrate

# Rollback last migration
$ make rollback

# Check migration status
$ make status

# Access database shell
$ make db-shell
```

## Production

```bash
# Start production environment
$ make prod-up

# Stop production environment
$ make prod-down

# Build production services
$ make prod-build

# Full production deployment (down, build, up)
$ make prod-deploy

# View production logs
$ make prod-logs
```

## Development Tools

```bash
# Access app container shell
$ make shell

# Clean up all containers and volumes
$ make clean

# Show all available commands
$ make help
```

## Project Structure

```
src/
├── app.controller.ts    # Sample controller
├── app.service.ts       # Sample service
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## Adding New Features

To add new features:

1. Create a new module: `nest g module your-module`
2. Create a controller: `nest g controller your-module`
3. Create a service: `nest g service your-module`

## License

This project is [MIT licensed](LICENSE).
