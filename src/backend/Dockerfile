#
# This Docker container will be used to run the FastAPI backend.
#
FROM continuumio/miniconda3

# Expose port 8000
EXPOSE 8000

# Copy only the environment.yml file initially to avoid cache invalidation
COPY environment.yml .

# Create a conda environment from the environment.yml file
RUN conda env create -f environment.yml

# Copy the rest of the source code into the container
COPY . .

# Start the application using Uvicorn with conda run
CMD ["conda", "run", "--no-capture-output", "-n", "movers", "uvicorn", "main:app", "--port", "8000", "--host", "0.0.0.0"]
