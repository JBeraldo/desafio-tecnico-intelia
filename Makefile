dev:
	docker run --rm -itv $(shell pwd)/backend:/app -w /app composer:2.7.2 composer install --no-scripts --ignore-platform-reqs
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
prod:
	docker compose up -d
stop:
	docker compose down
