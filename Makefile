dev:
	docker run --rm -itv $(shell pwd)/backend:/app -w /app composer:2.7.2 composer install --no-scripts --ignore-platform-reqs
	docker compose --env-file=./backend/.env.local -f docker-compose.yml -f docker-compose.dev.yml up -d --build
prod:
	docker compose --env-file=./backend/.env.local up --build
stop:
	docker compose down
ref:
	docker compose down
	docker compose up --build -d