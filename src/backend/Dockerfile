#
# This Docker container will be used to run the FastAPI backend.
#
FROM python:3.12-slim

# Install z3 solver
RUN apt-get update && apt-get install -y build-essential z3

# Expose port 8000
EXPOSE 8000

# Copy the source code into the container
COPY . .

# Install Uvicorn
RUN pip install uvicorn 
RUN pip install fastapi
RUN pip install pydantic
RUN pip install python-dotenv 
RUN pip install z3-solver

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "backend", "--port", "5641"]