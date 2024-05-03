.PHONY: export
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