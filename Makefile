dc := docker compose
dc-dev := $(dc) -p wololo-dev
dc-prod := $(dc) -p wololo-prod

.PHONY: install
install:
	$(dc-dev) --file ./compose.dev.yml run wololo-client npm install

.PHONY: build
build:
	$(dc-dev) --file ./compose.dev.yml build --no-cache

.PHONY: up
up:
	$(dc-dev) --file ./compose.dev.yml up --watch

.PHONY: down
down:
	$(dc-dev) --file ./compose.dev.yml down

.PHONY: prod
prod:
	$(dc-prod) --file ./compose.yml --file ./compose.local.yml up --build -d
