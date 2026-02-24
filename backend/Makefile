.PHONY: run build docker-up docker-down docker-rebuild logs swagger

run:
	go run cmd/server/main.go

build:
	go build -o bin/server cmd/server/main.go

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-rebuild:
	docker-compose up -d --build

logs:
	docker-compose logs -f server

logs-db:
	docker-compose logs -f db

swagger:
	swag init -g cmd/server/main.go -o docs --parseDependency --parseInternal
