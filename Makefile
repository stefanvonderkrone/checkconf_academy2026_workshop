.PHONY: dev stop install

dev:
	bash .dev/start.sh

stop:
	bash .dev/stop.sh

install:
	cd webapp && pnpm install
