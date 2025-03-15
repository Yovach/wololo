dc := docker compose -p wololo-dev

.PHONY: install
install:
	$(dc) --file ./compose.dev.yml run wololo-client npm install

.PHONY: build
build:
	$(dc) --file ./compose.dev.yml build

.PHONY: up
up:
	$(dc) --file ./compose.dev.yml up --watch

.PHONY: down
down:
	$(dc) --file ./compose.dev.yml down
