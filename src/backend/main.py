from dotenv import dotenv_values
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from modules.models.api import Forniture, build_response
from modules.solver.solver import MoversSolver
from modules.utils.logger import Logger
from modules.utils.validators import validate_forniture
from modules.models.solution import MoverCarryAction


def api_route(version: int, route: str) -> str:
    return f"/api/v{version}/{route}"


# Load environment variables
config = dotenv_values(".env")

# Load API version + frontend URL for CORS
frontend_url = config.get("FRONTEND_URL")
api_version = config.get("API_VERSION")
is_debug_mode = config.get("DEBUG", False)

# Cast debug mode to a boolean
is_debug_mode = str(is_debug_mode).lower() == "true"

# Ensure that both the frontend URL and API version are set
if not frontend_url or not api_version:
    raise ValueError("FRONTEND_URL and API_VERSION must be set in .env file")

# First, intialize the logger singleton
Logger(debug=is_debug_mode)

# Now, log the loaded frontend URL and API version
if is_debug_mode:
    Logger().info("Loaded environment variables from .env:")
    Logger().info(f"- FRONTEND_URL: {frontend_url}")
    Logger().info(f"- API_VERSION: {api_version}")

# Create entrypoint
app = FastAPI(
    title="Movers-sat-solver API",
    description="Ths API is used to solve the Movers SAT problem",
    version=api_version,
    response_class=ORJSONResponse,
    debug=is_debug_mode,
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


# URL: /api/v#/solve?n_movers=...&n_floors=...&max_steps=...
@app.post(api_route(int(api_version), "solve"))
async def solveRoute(
    n_movers: int, n_floors: int, max_steps: int, forniture: list[Forniture]
):
    # Ensure that both n_movers and n_floors are positive integers
    if n_movers < 1 or n_floors < 1:
        return ORJSONResponse(
            build_response(
                success=False,
                message="n_movers and n_floors must be positive integers",
            )
        )
    # Ensure that max steps is a positive integer
    if max_steps < 1:
        return ORJSONResponse(
            build_response(
                success=False, message="max_steps must be a positive integer"
            )
        )
    # Validate forniture floors
    if not forniture:
        return ORJSONResponse(
            build_response(
                success=False, message="The forniture list must not be empty"
            )
        )
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
        f"Received problem instance: n={n_floors}, m={n_movers}, max_t={max_steps}, forniture={forniture}"
    )

    # Create movers problem instance
    problem = MoversSolver(n=n_floors, m=n_movers, max_t=max_steps, forniture=forniture)
    ids = problem.movers_ids()

    # get the solution + get the states of the movers and forniture
    solution = problem.solve()
    if not solution:
        Logger().error("Solver error: No solution found")
        return ORJSONResponse(
            build_response(success=False, message="No solution found.")
        )
    movers_states, forniture_states = solution.get_solution()

    def build_action(state):
        def build_data():
            if isinstance(state._action, MoverCarryAction):
                return {"forniture": state._action._forniture.name}
            else:
                return None

        if state._action:
            return {"type": state._action._action_type.value, "data": build_data()}
        else:
            return None

    # For each time step, print the movers and forniture states
    response = {
        "total_steps": 0,
        "movers_names": ids,
        "simulation_steps": [],
    }

    total_steps = 0
    for t in movers_states.keys():
        # Create response entry
        entry = {"movers": [], "forniture": []}

        all_ground = True
        for state in forniture_states[t]:
            entry["forniture"].append(
                {
                    "name": state._forniture.name,
                    "floor": state._floor,
                }
            )
            if all_ground and state._floor != 0:
                all_ground = False

        # Now, print all states of movers
        for state in movers_states[t]:
            entry["movers"].append(
                {
                    "name": state._mover,
                    "floor": state._floor,
                    "action": build_action(state),
                }
            )
            if all_ground and state._floor != 0:
                all_ground = False

        # Save entry in simulation
        response["simulation_steps"].append(entry)

        total_steps += 1

        # If finished, break
        if all_ground:
            break

    # Register total steps
    response["total_steps"] = total_steps

    # Return JSON response
    Logger().info("Problem instance solved successfully")
    return ORJSONResponse(
        build_response(
            success=True,
            message="The problem instance has been solved optimally.",
            data=response,
        )
    )
