# this class will contain the solver for the movers problem!
from modules.models.api import Forniture
from z3 import Solver, Bool


class MoversSolver:
    # Decorator to ensure that the problem has been solved before accessing the solution
    @staticmethod
    def EnsureSolved(func):
        def wrapper(self, *args, **kwargs):
            if not self._is_solved:
                raise ValueError("The problem has not been solved yet!")
            return func(self, *args, **kwargs)

    def __init__(self, n: int, m: int, forniture: list[Forniture]) -> None:
        # Save the problem instance
        self._n = n
        self._m = m
        self._forniture = forniture
        # Add some utility variables
        self._is_solved = False
        self._solution = None
        # Initialize the solver
        self._solver = Solver()
        # Build the model
        # 1. Add required variables
        self._build_variables()
        # 2. Add action definitions (how actions alter the state of the problem instance)
        self._build_action_definitions()
        # 3. Add constraints
        self._build_constraints()

    def _build_variables(self) -> None:
        # Create all the required variables
        # for i in range(self._n):
        #     for j in range(self._m):
        #         for t_i in range(self._m):
        raise NotImplementedError("Variable creation not implemented yet!")

    def _build_action_definitions(self) -> None:
        # TODO:: Add action definitions from the README
        # Define the actions
        self._actions = []

    def _build_constraints(self) -> None:
        # TODO: Add constraints from the README
        # Add constraints
        raise NotImplementedError("Constraints not implemented yet!")

    def solve(self) -> str:
        # TODO: Start the actual solving process
        raise NotImplementedError("Solving process not implemented yet!")

    @EnsureSolved
    def get_solution(self):
        return self._solution
