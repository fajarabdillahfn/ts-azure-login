.PHONY: up down build rebuild logs migrate rollback status clean help prod-up prod-down prod-build prod-logs prod-migrate prod-clean prod-deploy

# Default target
.DEFAULT_GOAL := help

# Variables
COMPOSE = docker compose
COMPOSE_PROD = docker compose -f docker-compose.prod.yml
APP_SERVICE = app
DB_SERVICE = postgres

help: ## Show this help message
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*##"; printf "\033[36m"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-15s %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

up: ## Start all services in development mode
	$(COMPOSE) up -d

down: ## Stop all services in development mode
	$(COMPOSE) down

build: ## Build all services for development
	$(COMPOSE) build

rebuild: down ## Rebuild and restart all services in development mode
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

logs: ## Show logs of all services
	$(COMPOSE) logs -f

app-logs: ## Show logs of the app service
	$(COMPOSE) logs -f $(APP_SERVICE)

db-logs: ## Show logs of the database service
	$(COMPOSE) logs -f $(DB_SERVICE)

migrate: ## Run database migrations
	$(COMPOSE) up liquibase

rollback: ## Rollback the last migration
	$(COMPOSE) run --rm liquibase rollback-count 1

status: ## Show migration status
	$(COMPOSE) run --rm liquibase status

shell: ## Open a shell in the app container
	$(COMPOSE) exec $(APP_SERVICE) sh

db-shell: ## Open a psql shell in the database container
	$(COMPOSE) exec $(DB_SERVICE) psql -U orbit_user -d orbit_db

clean: down ## Remove all containers, volumes, and build cache
	$(COMPOSE) down -v
	docker system prune -f

restart: down up ## Restart all services

install: ## Install dependencies using pnpm
	pnpm install

dev: build up ## Start development environment
	@echo "Starting development environment..."
	@echo "App will be available at http://localhost:3300"
	@$(COMPOSE) logs -f $(APP_SERVICE)

# Production commands
prod-up: ## Start all services in production mode
	$(COMPOSE_PROD) up -d

prod-down: ## Stop all services in production mode
	$(COMPOSE_PROD) down

prod-build: ## Build all services for production
	$(COMPOSE_PROD) build --no-cache

prod-logs: ## Show logs of all services in production mode
	$(COMPOSE_PROD) logs -f

prod-migrate: ## Run database migrations in production
	$(COMPOSE_PROD) up liquibase

prod-clean: ## Clean up production resources
	$(COMPOSE_PROD) down -v
	docker system prune -f

prod-deploy: prod-down prod-build prod-up ## Full production deployment
