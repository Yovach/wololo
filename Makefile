dc := docker compose -p wololo-dev

.PHONY: install
install:
	$(dc) --file ./compose.dev.yml run wololo-client npm install

.PHONY: dev
dev:
	$(dc) --file ./compose.dev.yml up --watch

.PHONY: down
down:
	$(dc) --file ./compose.dev.yml down
