from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Constants
# FIXME: Move these settings in a .env file!
FRONTEND_URL = "http://localhost:3000"
API_VERSION = 1

# Create entrypoint
app = FastAPI(response_class=ORJSONResponse)
origins = [
    FRONTEND_URL
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # NOTE: Options is needed for Preflight requests!
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Example URL: /api/v1/hello-world


@app.get(f"/api/v{API_VERSION}/hello-world")
async def helloWorldRoute():
    return ORJSONResponse({
        "message": "Hello from from FastAPI backend!"
    })
