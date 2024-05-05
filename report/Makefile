.PHONY: build
build:
	@echo "Building LaTeX document..."
	@pdflatex -interaction=nonstopmode -halt-on-error movers_report.tex
	@bibtex movers_report.aux
	@pdflatex -interaction=nonstopmode -halt-on-error movers_report.tex
	@pdflatex -interaction=nonstopmode -halt-on-error movers_report.tex
	@echo "Done."