user := $(shell id -u)
group := $(shell id -g)

dc := USER_ID=$(user) GROUP_ID=$(group) docker compose -p wololo-dev

.PHONY: dev
dev:
	$(dc) --file ./compose.dev.yml up

.PHONY: down
down:
	$(dc) --file ./compose.dev.yml down
