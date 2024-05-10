from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values
from modules.models.api import Forniture
from modules.solver.movers import solve_problem
from modules.utils.logger import Logger


def api_route(version: int, route: str) -> str:
    return f"/api/v{version}/{route}"


# Load environment variables
config = dotenv_values(".env")

# Load API version + frontend URL for CORS
frontend_url = config.get("FRONTEND_URL")
api_version = config.get("API_VERSION")
debug_mode = config.get("DEBUG", False)

# Cast API version to an integer
if api_version:
    api_version = int(api_version)

# Cast debug mode to a boolean
debug_mode = str(debug_mode).lower() == "true"

# Ensure that both the frontend URL and API version are set
if not frontend_url or not api_version:
    raise ValueError("FRONTEND_URL and API_VERSION must be set in .env file")

# Create entrypoint
app = FastAPI(response_class=ORJSONResponse, debug=debug_mode)
origins = [frontend_url]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # NOTE: Options is needed for Preflight requests!
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# URL: /api/v#/hello-world
@app.get(api_route(api_version, "hello-world"))
async def helloWorldRoute():
    return ORJSONResponse({"message": "Hello from from FastAPI backend!"})


# URL: /api/v#/hello-world
@app.post(api_route(api_version, "solve"))
async def solveRoute(n_movers: int, n_floors: int, forniture: list[Forniture]):
    # Start solver with the data
    Logger().info(f"Received data: {n_movers}, {n_floors}, {forniture}")
    result = solve_problem(n_movers, n_floors, forniture)
    Logger().info(f"Solver result: {result}")

    # Solve the movers sat problem using z3-solver
    return ORJSONResponse({"message": "Solve route!"})
