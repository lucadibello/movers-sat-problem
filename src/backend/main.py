from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values
from modules.utils.validators import validate_forniture
from modules.models.api import Forniture, build_response
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

# Cast debug mode to a boolean
debug_mode = str(debug_mode).lower() == "true"

# Ensure that both the frontend URL and API version are set
if not frontend_url or not api_version:
    raise ValueError("FRONTEND_URL and API_VERSION must be set in .env file")

# Create entrypoint
app = FastAPI(
    title="Movers-sat-solver API",
    description="Ths API is used to solve the Movers SAT problem",
    version=api_version,
    response_class=ORJSONResponse,
    debug=debug_mode,
)
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
@app.get(api_route(int(api_version), "hello-world"))
async def helloWorldRoute():
    return ORJSONResponse({"message": "Hello from from FastAPI backend!"})


# URL: /api/v#/hello-world
@app.post(api_route(int(api_version), "solve"))
async def solveRoute(n_movers: int, n_floors: int, forniture: list[Forniture]):
    # Ensure that both n_movers and n_floors are positive integers
    if n_movers < 1 or n_floors < 1:
        return ORJSONResponse(
            build_response(
            success=False,
            message="n_movers and n_floors must be positive integers",
            )
        )
    # Validate forniture floors
    status = validate_forniture(n_floors, forniture)
    if not status:
        return ORJSONResponse(
            build_response(
                success=False,
                message="Invalid forniture name or floor. The name must be a non-empty alphanumeric string and the floor must be an integer from 0 to n_floors-1",
            )
        )

    # Start solver with the data
    Logger().info(
        f"Received problem instance: n_movers={n_movers}, n_floors={n_floors}, forniture={forniture}"
    )
    result = solve_problem(n_movers, n_floors, forniture)
    Logger().info(f"Solver result: {result}")

    # Solve the movers sat problem using z3-solver
    return ORJSONResponse({"message": "Solve route!"})
