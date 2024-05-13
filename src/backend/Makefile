.PHONY: dev
dev:
	uvicorn main:app --reload --port 8000 --host 0.0.0.0

.PHONY: start
start:
	uvicorn main:app --port 8000 --host 0.0.0.0

.PHONY: checker
checker:
	python3 prover/first_task.py

.PHONY: build-index
build-index:
	python3 build-index.py

export:
	@echo "Exporting environment.yml..."
	@conda env export --no-builds -f environment.yml
	@echo "Done"

.PHONY: activate
activate:
	@conda activate movers

.PHONY: deactivate
deactivate:
	@conda deactivate

.PHONY: update_deps
update_deps:
	@conda env update --file environment.yml --prune
