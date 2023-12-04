.PHONY: build
build:
	docker build -t frontend .

.PHONY: run
run:
	docker run -p 8082:3000 --name frontend -d frontend


.PHONY: test
test:
	curl localhost:8082/


.PHONY: clear
clear:
	docker stop frontend || true && \
  	docker rm frontend || true