#
# This Docker container will be used to run the FastAPI backend.
#
FROM continuumio/miniconda3

# Copy locally the environment.yml file
COPY environment.yml .

# Create a conda environment from the environment.yml file
RUN conda env create -f environment.yml

# Activate the conda environment
SHELL ["conda", "run", "-n", "movers", "/bin/bash", "-c"]

# Copy the source code into the container
COPY . .

# Now, start the application using Uvicorn
CMD ["conda", "run", "--no-capture-output", "-n", "movers", "uvicorn", "main:app", "--port", "8000", "--host", "0.0.0.0"]
